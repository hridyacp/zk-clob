import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, Repeat } from 'lucide-react';
import { BlockyButton } from '../ui/BlockyButton';
import { useWallet } from '../contexts/WalletContext';
import type { TradeDetails } from '../../pages/TradingPage';
import { chainOptions, type Chain } from '../../config/wagmi';

interface TradingTerminalProps {
  onReview: (details: TradeDetails) => void;
}

const TradingTerminal: React.FC<TradingTerminalProps> = ({ onReview }) => {
  const [tradeType, setTradeType] = useState<'Trade'>('Trade');
  const [fromChain, setFromChain] = useState<Chain>('base');
  const [toChain, setToChain] = useState<Chain>('horizen');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  const { isConnected, connectWallet, chainId, switchChain } = useWallet();

  // Auto-switch network when 'fromChain' changes
  useEffect(() => {
    if (isConnected) {
      const selectedChain = chainOptions.find(c => c.id === fromChain);
      if (selectedChain && selectedChain.chainId !== chainId) {
        switchChain(selectedChain.chainId);
      }
    }
  }, [fromChain, isConnected, chainId, switchChain]);

  // Mock price calculation
  useEffect(() => {
    if (fromAmount) {
      const amount = parseFloat(fromAmount) * 0.998; // Mock price
      setToAmount(amount.toFixed(4));
    } else {
      setToAmount('');
    }
  }, [fromAmount]);

  const handleReviewClick = () => {
    if (parseFloat(fromAmount) > 0) {
      onReview({
        tradeType,
        fromChain,
        toChain,
        fromAmount,
        toAmount,
      });
    }
  };
  
  const handleReverse = () => {
    const currentFrom = fromChain;
    setFromChain(toChain);
    setToChain(currentFrom);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg bg-mc-dark backdrop-blur-2xl border border-indigo-500/30 rounded-2xl p-8 shadow-mc-glow"
    >
      {/* Buy/Sell Tabs */}
      <div className="flex bg-gray-800/50 p-1 rounded-xl justify-center mb-6">
        <Tab type="Trade" currentType={tradeType} setType={setTradeType} />
      </div>

      {/* Inputs */}
      <div className="relative space-y-6">
        <ChainInput 
          label="From" 
          selectedChain={fromChain} 
          setChain={setFromChain} 
          amount={fromAmount} 
          setAmount={setFromAmount}
          className="bg-gray-800/50 border-indigo-500/30 shadow-block"
        />
         
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.button 
            onClick={handleReverse} 
            className="w-12 h-12 bg-indigo-400/80 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-mc-glow"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <Repeat size={24} className="text-white" />
          </motion.button>
        </div>

        <ChainInput 
          label="To" 
          selectedChain={toChain} 
          setChain={setToChain} 
          amount={toAmount} 
          readOnly 
          className="bg-gray-800/50 border-indigo-500/30 shadow-block"
        />
      </div>

      {/* Action Button */}
      <div className="mt-8">
        {isConnected ? (
          <BlockyButton 
            onClick={handleReviewClick} 
            disabled={!fromAmount || parseFloat(fromAmount) <= 0} 
            color={ 'green' }
            className="bg-mc-gradient hover:shadow-mc-glow w-full"
          >
            Review Trade
          </BlockyButton>
        ) : (
          <BlockyButton 
            onClick={connectWallet} 
            color="blue"
            className="bg-mc-gradient hover:shadow-mc-glow w-full"
          >
            Connect Wallet
          </BlockyButton>
        )}
      </div>
    </motion.div>
  );
};

// Tab Component
interface TabProps {
  type: 'Trade';
  currentType: 'Trade';
  setType: (type: 'Trade') => void;
}

const Tab: React.FC<TabProps> = ({ type, currentType, setType }) => {
  const isActive = type === currentType;
  const color = 'bg-mc-green';
  return (
    <motion.button
      onClick={() => setType(type)}
      className={`w-1/2 p-3 text-center uppercase font-minecraft font-semibold text-white rounded-lg ${isActive ? `${color} shadow-block` : 'bg-gray-900/50 hover:bg-gray-800/50'}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {type}
    </motion.button>
  );
};

// Chain Input Component
interface ChainInputProps {
  label: string;
  selectedChain: Chain;
  setChain: (chain: Chain) => void;
  amount: string;
  setAmount?: (amount: string) => void;
  readOnly?: boolean;
  className?: string;
}

const ChainInput: React.FC<ChainInputProps> = ({ label, selectedChain, setChain, amount, setAmount, readOnly = false, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-xl bg-gray-800/50 border border-indigo-500/30 shadow-block ${className}`}
    >
      <label className="text-sm font-medium text-indigo-200 block mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <motion.select
          value={selectedChain}
          onChange={e => setChain(e.target.value as Chain)}
          className="bg-gray-900/50 p-3 border border-indigo-500/20 rounded-lg text-white font-minecraft text-lg focus:outline-none focus:border-indigo-400"
          whileHover={{ scale: 1.02 }}
        >
          {chainOptions.map(c => (
            <option key={c.id} value={c.id} className="bg-mc-dark text-white">
              {c.name}
            </option>
          ))}
        </motion.select>
        <input
          type="text"
          placeholder="0.0000"
          value={amount}
          onChange={e => setAmount && setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          readOnly={readOnly}
          className={`w-full bg-transparent text-right text-2xl font-bold text-white font-minecraft focus:outline-none placeholder-indigo-300/50 ${
            readOnly ? 'cursor-default' : 'hover:border-b-2 hover:border-indigo-400'
          }`}
        />
      </div>
    </motion.div>
  );
};

export default TradingTerminal;
