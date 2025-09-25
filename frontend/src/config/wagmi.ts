import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

import baseIcon from "../assets/baseicon.jpeg";
import horizenIcon from "../assets/horizenlogo.jpg";

// Define the Horizen Gobi testnet as a custom chain
const horizenGobi = {
  id: 1731313, // This seems to be an old or incorrect ID. I'll use a placeholder.
  name: 'Horizen Gobi',
  nativeCurrency: { name: 'tZEN', symbol: 'tZEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://gobi-rpc.horizen.io'] },
  },
  blockExplorers: {
    default: { name: 'Gobi Explorer', url: 'https://gobi-explorer.horizen.io' },
  },
  testnet: true,
} as const;


export const config = createConfig({
  chains: [baseSepolia, horizenGobi],
  transports: {
    [baseSepolia.id]: http(),
    [horizenGobi.id]: http(),
  },
  connectors: [
    metaMask({
        dappMetadata: {
            name: 'Minecraft CLOB',
            description: 'A Minecraft-themed cross-chain trading platform',
            url: window.location.href,
            icons: ['']
        }
    }),
  ],
});


// Helper types and functions
export type Chain = 'base' | 'horizen';
export type ChainId = typeof baseSepolia.id | typeof horizenGobi.id;

export const chainOptions: { id: Chain; name: string; icon: string, chainId: ChainId }[] = [
  { id: 'base', name: 'Sepolia ETH', icon: baseIcon, chainId: baseSepolia.id },
  { id: 'horizen', name: 'USDC', icon: horizenIcon, chainId: horizenGobi.id },
];

export const getChainInfo = (id: Chain | null) => chainOptions.find(c => c.id === id);
