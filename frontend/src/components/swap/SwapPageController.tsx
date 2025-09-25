import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwapCard } from './SwapCard';
import { useWallet } from '../../components/contexts/WalletContext';
import { ArrowDown, Repeat } from 'lucide-react';

// Define Chain types and options
export type ChainId = 84532 | 845320009;
export type Chain = 'base' | 'horizen' | '' | null;

const chainOptions: { id: Chain; name: string; chainId: ChainId }[] = [
  { id: 'base', name: 'Sepolia ETH', chainId: 84532 },
  { id: 'horizen', name: 'USDC', chainId: 845320009 },
];

export const SwapPageController: React.FC = () => {
  const [fromChain, setFromChain] = useState<Chain>('');
  const [toChain, setToChain] = useState<Chain>('');

  const { connectWallet, isConnected, switchChain, chainId, isSwitching, isConnecting } = useWallet();

  // Handle connection and network switching
  useEffect(() => {
    const selectedChainDetails = chainOptions.find(c => c.id === fromChain);
    if (!selectedChainDetails) return;

    if (!isConnected && !isConnecting) {
      connectWallet();
      return;
    }

    if (isConnected && !isSwitching && chainId !== selectedChainDetails.chainId) {
      switchChain(selectedChainDetails.chainId);
    }
  }, [fromChain, isConnected, isConnecting, chainId, isSwitching, connectWallet, switchChain]);

  // Prevent same-chain selection
  useEffect(() => {
    if (fromChain && fromChain === toChain) {
      setToChain('');
    }
  }, [fromChain, toChain]);

  const handleReverse = () => {
    const currentFrom = fromChain;
    const currentTo = toChain;
    if (!currentTo) return;
    setFromChain(currentTo);
    setToChain(currentFrom);
  };

  const isRouteSelected = fromChain && toChain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg space-y-6 p-4" // Increased max-width and spacing
    >
      <div className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Choose Your Swap Route</h2>
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium text-white/80 mb-2 block">From Chain</label>
            <select
              value={fromChain || ''}
              onChange={(e) => setFromChain(e.target.value as Chain)}
              className="w-full p-4 bg-black/20 border border-white/20 rounded-lg text-white text-lg focus:ring-2 focus:ring-brand-pink"
            >
              <option value="" disabled>Select a chain</option>
              {chainOptions.map(opt => (
                <option key={`from-${opt.id}`} value={opt.id || ''}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <motion.button
              onClick={handleReverse}
              className="w-12 h-12 bg-gray-900 rounded-full border-2 border-white/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <Repeat className="text-brand-pink w-6 h-6" />
            </motion.button>
          </div>

          <div>
            <label className="text-base font-medium text-white/80 mb-2 block">To Chain</label>
            <select
              value={toChain || ''}
              onChange={(e) => setToChain(e.target.value as Chain)}
              className="w-full p-4 bg-black/20 border border-white/20 rounded-lg text-white text-lg focus:ring-2 focus:ring-brand-pink"
            >
              <option value="" disabled>Select a chain</option>
              {chainOptions.filter(opt => opt.id !== fromChain).map(opt => (
                <option key={`to-${opt.id}`} value={opt.id || ''}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRouteSelected && (
          <motion.div 
            key="swap-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SwapCard
              fromChain={fromChain}
              toChain={toChain}
              onChangeRoute={() => { setFromChain(''); setToChain(''); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
