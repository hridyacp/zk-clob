import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ChevronsRight } from 'lucide-react';
import { useWallet } from '../../components/contexts/WalletContext';
import { useBalance } from 'wagmi';
import { TokenInput } from './TokenInput';
import { SwapButton } from './SwapButton';
import type { Chain } from './SwapPageController';

import baseIcon from "../../assets/baseicon.jpeg";
import horizenIcon from "../../assets/horizenlogo.jpg";
import SwapConfirmationModal from './SwapConfirmationModal';

interface SwapCardProps {
  fromChain: Chain;
  toChain: Chain;
  onChangeRoute: () => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({ fromChain, toChain, onChangeRoute }) => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address, isConnected } = useWallet();

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    query: { enabled: isConnected && !!address },
  });

  const getChainInfo = (chain: Chain) => {
    switch(chain) {
      case 'base': return { name: 'Sepolia ETH', icon: baseIcon, token: 'ETH' };
      case 'horizen': return { name: 'USDC', icon: horizenIcon, token: 'USDC' };
      default: return { name: '', icon: '', token: '' };
    }
  };

  const handleReviewSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert("Please enter a valid amount to swap.");
      return;
    }
    setIsModalOpen(true);
  };

  const fromChainInfo = getChainInfo(fromChain);
  const toChainInfo = getChainInfo(toChain);
  
  const handleAmountChange = (value: string) => {
    if (value !== '' && isNaN(Number(value))) return;
    setFromAmount(value);
    if (value === '' || Number(value) === 0) {
      setToAmount('');
      return;
    }
    const calculatedToAmount = parseFloat(value) * 25.5; // Mock calculation
    setToAmount(calculatedToAmount.toFixed(4));
  };
  
  const formattedBalance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0';

  return (
    <>
      <SwapConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        swapDetails={{
          fromAmount,
          fromToken: fromChainInfo.token,
          fromIcon: fromChainInfo.icon,
          toAmount,
          toToken: toChainInfo.token,
          toIcon: toChainInfo.icon,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-xl"
      >
       <div className="flex items-center gap-3">
    <img src={fromChainInfo.icon} alt={fromChainInfo.name} className="w-8 h-8 rounded-full" />
    <ChevronsRight className="text-indigo-400" size={24} />
    <img src={toChainInfo.icon} alt={toChainInfo.name} className="w-8 h-8 rounded-full" />
  </div>
  <button 
    onClick={onChangeRoute} 
    className="text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
  >
    Change Route
  </button>
        <div className="relative space-y-6">
          <TokenInput
            label="You pay"
            tokenSymbol={fromChainInfo.token}
            tokenIcon={fromChainInfo.icon}
            amount={fromAmount}
            onAmountChange={handleAmountChange}
            balance={formattedBalance}
            isLoadingBalance={isBalanceLoading}
            className="bg-gray-800/50 border-indigo-500/30 focus-within:border-indigo-500"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-indigo-600/80 rounded-full border-4 border-gray-900 flex items-center justify-center"
            >
              <ArrowDown className="text-white" size={24} />
            </motion.div>
          </div>
          <TokenInput
    className="bg-gray-800/50 border-indigo-500/30 focus-within:border-indigo-400 shadow-block"
  />
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
    <motion.div 
      whileHover={{ scale: 1.1 }}
      className="w-12 h-12 bg-indigo-400/80 rounded-full border-4 border-gray-900 flex items-center justify-center"
    >
      <ArrowDown className="text-white" size={24} />
    </motion.div>
  </div>
  <SwapButton 
    onClick={() => handleReviewSwap()} 
    className="bg-mc-gradient hover:shadow-mc-glow"
  />
        </div>
      </motion.div>
    </>
  );
};
