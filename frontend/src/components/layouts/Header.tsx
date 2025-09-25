import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { BlockyButton } from '../ui/BlockyButton';
import { ethers } from "ethers";

const Header: React.FC = () => {
  const { isConnected, address,evmSigner, connectWallet, disconnect} = useWallet();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const DUMMY_CONTRACT_ADDRESS= "";
  const DUMMY_CONTRACT_ABI=""
  

  // Shorten wallet address for display
  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Open/close deposit modal
  const handleDeposit = () => {
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
    setDepositAmount('');
  };

  // Dummy smart contract call for deposit
  const handleDepositConfirm = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(DUMMY_CONTRACT_ADDRESS, DUMMY_CONTRACT_ABI, evmSigner);
    const apprtx = await contract.approve(
     
    );
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Simulate a smart contract call
      console.log('Calling smart contract deposit function...');
      console.log('Contract: ZKClobCraft');
      console.log('Function: deposit(address user, uint256 amount)');
      console.log('Parameters:', { user: address, amount: depositAmount });

      // Mock async call (replace with actual contract interaction)
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Successfully deposited ${depositAmount} ETH!`);
      closeDepositModal();
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    }
  };

  return (
    <>
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-wider font-minecraft bg-gradient-to-r from-indigo-400 to-purple-600 text-transparent bg-clip-text"
        >
          ZK-CLOB CRAFT
        </motion.div>
        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:block bg-gray-800/50 p-3 rounded-lg border border-indigo-500/30 text-indigo-200 font-minecraft text-sm"
              >
                {shortenAddress(address)}
              </motion.p>
              <BlockyButton
                onClick={handleDeposit}
                color="green"
                className="px-6 py-3 text-base font-minecraft bg-mc-gradient hover:shadow-mc-glow"
              >
                Deposit
              </BlockyButton>
              <BlockyButton
                onClick={() => disconnect()}
                color="red"
                className="px-6 py-3 text-base font-minecraft bg-mc-gradient hover:shadow-mc-glow"
              >
                Disconnect
              </BlockyButton>
            </>
          ) : (
            <BlockyButton
              onClick={connectWallet}
              color="blue"
              className="px-6 py-3 text-base font-minecraft bg-mc-gradient hover:shadow-mc-glow"
            >
              Connect Wallet
            </BlockyButton>
          )}
        </div>
      </header>

      {/* Deposit Modal */}
      <AnimatePresence>
        {isDepositModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 font-minecraft"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-mc-dark backdrop-blur-2xl border border-indigo-500/30 rounded-2xl p-8 shadow-mc-glow"
            >
              <button
                onClick={closeDepositModal}
                className="absolute top-4 right-4 text-indigo-200 hover:text-indigo-100 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-center text-2xl uppercase font-bold text-white mb-6">
                Deposit Funds
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-indigo-500/20 shadow-block">
                  <label className="text-sm font-medium text-indigo-200 block mb-2">Amount (ETH)</label>
                  <input
                    type="text"
                    placeholder="0.0000"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full bg-transparent text-right text-2xl font-bold text-white font-minecraft focus:outline-none placeholder-indigo-300/50 hover:border-b-2 hover:border-indigo-400"
                  />
                </div>
                <BlockyButton
                  onClick={handleDepositConfirm}
                  color="green"
                  className="w-full bg-mc-gradient hover:shadow-mc-glow"
                >
                  Deposit
                </BlockyButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
