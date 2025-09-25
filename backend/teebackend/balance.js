import fs from 'fs';
import {ethers} from 'ethers';
import crypto from 'crypto';
import { swap } from './orderbook.js';

// In-memory balances: { "userAddress": { "tokenAddress": BigNumber } }
const balances = {};

// Simple order book structure of having {"give": "tokenaddress", "giveamount":"number", "take": "tokenaddress", "takeamount":"number"}
const orderBook = {};

const { privateKeyPem, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },   // public key in SPKI PEM
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, // private key in PKCS#8 PEM
});
const encrypted = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  },
  Buffer.from(JSON.stringify({
    user: "0xUserAddress",
    give: "0xTokenA",
    giveAmount: "1000000000000000000", // 1 TokenA (assuming 18 decimals)
    take: "0xTokenB",
    takeAmount: "500000000000000000"   // 0.5 TokenB (assuming 18 decimals)
  }))
);
console.log("Encrypted order:", encrypted.toString('base64'));

const provider = new ethers.JsonRpcProvider("https://horizen-rpc-testnet.appchain.base.org/");
const contractAddress = "0x88D7D6547D5A12b7B0b2c41A897b63aa3b946661";
const abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));


const contract = new ethers.Contract(contractAddress, abi, provider);

// Listen for Deposit events
contract.on("Deposit", (sender, token, amount, event) => {
  console.log("Sender:", sender);
  console.log("Token:", token);
  console.log("Amount:", ethers.formatUnits(amount, 18));
  console.log("Event details:", event);

    if (!balances[sender]) {
      balances[sender] = {};
    }
    if (!balances[sender][token]) {
      balances[sender][token] = ethers.BigNumber.from(0);
    }
    balances[sender][token] = balances[sender][token].add(amount);
});

// Listen for Withdraw events
contract.on("Withdraw", (sender, token, amount, event) => {
  console.log("Sender:", sender);
  console.log("Token:", token);
  console.log("Amount:", ethers.formatUnits(amount, 18));
  console.log("Event details:", event);

    if (!balances[sender]) {
      balances[sender] = {};
    }
    if (!balances[sender][token]) {
      balances[sender][token] = ethers.BigNumber.from(0);
    }
    balances[sender][token] = balances[sender][token].sub(amount);
});

// Listen for Swap events
contract.on("Swap", (sender, tx, event) => {
  console.log("Sender:", sender);
  console.log("Transaction:", tx);
  console.log("Event details:", event);
  const plaintext = crypto.privateDecrypt(
    { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    Buffer.from(tx)
    );
    const order = JSON.parse(plaintext.toString());
    console.log("Decrypted order:", order);
    balances[sender][order.give] = balances[sender][order.give].sub(ethers.BigNumber.from(order.giveAmount));
    orderBook, balances = swap(orderBook, balances);
});

console.log("Listening for events...");
