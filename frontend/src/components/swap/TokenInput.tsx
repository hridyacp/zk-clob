import React from 'react';
import { motion } from 'framer-motion';

interface TokenInputProps {
  label: string;
  tokenSymbol: string;
  tokenIcon: string;
  amount: string;
  onAmountChange?: (value: string) => void;
  balance?: string;
  isReadOnly?: boolean;
  isLoadingBalance?: boolean;
  className?: string;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  label,
  tokenSymbol,
  tokenIcon,
  amount,
  onAmountChange,
  balance,
  isReadOnly = false,
  isLoadingBalance = false,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-5 rounded-xl bg-gray-800/50 border border-indigo-500/30 ${className}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-indigo-200">{label}</span>
        <span className="text-sm font-medium text-indigo-200">
          Balance: {isLoadingBalance ? <span className="animate-pulse">...</span> : balance || '0.0000'}
        </span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <motion.div 
          className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg flex-shrink-0 border border-indigo-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <img src={tokenIcon} alt={tokenSymbol} className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-white text-lg">{tokenSymbol}</span>
        </motion.div>
        <input
          type="text"
          value={amount}
          onChange={(e) => onAmountChange && onAmountChange(e.target.value.replace(/[^0-9.]/g, ''))}
          readOnly={isReadOnly}
          placeholder="0.0000"
          className={`bg-transparent text-3xl font-bold text-right text-white w-full focus:outline-none placeholder-indigo-300/50 ${
            isReadOnly ? 'cursor-default' : 'hover:border-b-2 hover:border-indigo-400'
          }`}
        />
      </div>
    </motion.div>
  );
};
