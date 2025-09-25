import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, CheckCircle, ExternalLink, X, Loader2 } from 'lucide-react';

const ModalButton = ({ onClick, children, variant = 'primary', className = '' }: { onClick: () => void, children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) => {
  const baseClasses = "w-full py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    : "bg-gray-700/50 hover:bg-gray-600/50 border border-white/20";

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
};

interface SwapDetails {
  fromAmount: string;
  fromToken: string;
  fromIcon: string;
  toAmount: string;
  toToken: string;
  toIcon: string;
}

interface SwapConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  swapDetails: SwapDetails;
}

const SwapConfirmationModal: React.FC<SwapConfirmationModalProps> = ({ isOpen, onClose, swapDetails }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  const handleConfirmSwap = async () => {
    setStep(2);
    await new Promise(resolve => setTimeout(resolve, 3500));
    setStep(3);
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold text-white text-center mb-6">Review Swap</h3>
            <div className="space-y-4">
              <div className="p-5 bg-gray-800/50 rounded-xl border border-indigo-500/30">
                <span className="text-sm text-indigo-200">You pay</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-3xl font-bold text-white">{swapDetails.fromAmount}</span>
                  <div className="flex items-center gap-3">
                    <img src={swapDetails.fromIcon} alt={swapDetails.fromToken} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-white">{swapDetails.fromToken}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center"><ArrowDown className="w-8 h-8 text-indigo-400" /></div>
              <div className="p-5 bg-gray-800/50 rounded-xl border border-indigo-500/30">
                <span className="text-sm text-indigo-200">You receive (estimated)</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-3xl font-bold text-white">{swapDetails.toAmount}</span>
                  <div className="flex items-center gap-3">
                    <img src={swapDetails.toIcon} alt={swapDetails.toToken} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-white">{swapDetails.toToken}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-indigo-200 flex justify-between pt-5 mt-5 border-t border-white/20">
              <span>Estimated Gas Fee</span>
              <span className="text-white">0.005 ETH</span>
            </div>
            <div className="mt-8">
              <ModalButton onClick={handleConfirmSwap}>Confirm Swap</ModalButton>
            </div>
          </>
        );

      case 2:
        return (
          <div className="text-center space-y-8 flex flex-col items-center">
            <Loader2 size={80} className="mx-auto text-indigo-400 animate-spin" />
            <h3 className="text-2xl font-bold text-white">Processing Transaction</h3>
            <div className="text-left text-base space-y-4 text-indigo-200 w-full p-6 bg-gray-800/50 rounded-lg">
              <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0}} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400"/>
                <span>Initiating swap...</span>
              </motion.p>
              <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1}} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400"/>
                <span>Awaiting confirmation...</span>
              </motion.p>
              <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 2}} className="flex items-center gap-3 animate-pulse">
                <span className="w-5 h-5 rounded-full bg-indigo-400/30 flex-shrink-0"></span>
                <span>Broadcasting to network...</span>
              </motion.p>
            </div>
            <p className="text-sm text-indigo-200">Please do not close this window.</p>
          </div>
        );
        
      case 3:
        return (
          <div className="text-center space-y-8 flex flex-col items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <CheckCircle size={80} className="mx-auto text-emerald-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">Swap Successful!</h3>
            <p className="text-base text-indigo-200">
              You successfully swapped {swapDetails.fromAmount} {swapDetails.fromToken} for {swapDetails.toAmount} {swapDetails.toToken}.
            </p>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base text-indigo-400 hover:text-indigo-300">
              View on Block Explorer <ExternalLink size={16} />
            </a>
            <div className="w-full pt-6">
              <ModalButton onClick={onClose} variant="secondary">Close</ModalButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-xl relative"
          >
            {step !== 2 && (
              <button onClick={onClose} className="absolute top-4 right-4 text-indigo-200 hover:text-indigo-100 transition-colors">
                <X size={24} />
              </button>
            )}
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwapConfirmationModal;
