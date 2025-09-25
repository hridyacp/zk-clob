import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { TradeDetails } from '../../pages/TradingPage';
import { BlockyButton } from '../ui/BlockyButton';
import { getChainInfo } from '../../config/wagmi';

interface ReviewModalProps {
  details: TradeDetails;
  onClose: () => void;
  onConfirm: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ details, onClose, onConfirm }) => {
  const from = getChainInfo(details.fromChain);
  const to = getChainInfo(details.toChain);

  return (
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
          onClick={onClose} 
          className="absolute top-4 right-4 text-indigo-200 hover:text-indigo-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-center text-2xl uppercase font-bold text-white mb-6">
          Review {details.tradeType}
        </h2>
        
        <div className="space-y-4">
          <DetailRow label="From" value={from?.name || 'Unknown Chain'} />
          <DetailRow label="To" value={to?.name || 'Unknown Chain'} />
          <DetailRow 
            label={details.tradeType === 'buy' ? 'You Pay' : 'You Sell'} 
            value={`${details.fromAmount} ${from?.token || 'ETH'}`} 
          />
          <DetailRow 
            label="You Receive" 
            value={`${details.toAmount} ${to?.token || 'ETH'}`} 
          />
          <DetailRow label="Est. Gas Fee" value="0.0015 ETH" />
        </div>

        <div className="mt-8">
          <BlockyButton 
            onClick={onConfirm} 
            color={'green' }
            className="w-full bg-mc-gradient hover:shadow-mc-glow"
          >
            Confirm {details.tradeType}
          </BlockyButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-indigo-500/20 shadow-block"
  >
    <span className="text-base text-indigo-200 font-semibold">{label}</span>
    <span className="text-base text-white font-semibold">{value}</span>
  </motion.div>
);

export default ReviewModal;
