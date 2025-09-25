import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader } from 'lucide-react';
import type { TradeDetails } from '../../pages/TradingPage';
import { BlockyButton } from '../ui/BlockyButton';

interface TransactionStatusModalProps {
  details: TradeDetails;
  onClose: () => void;
}

const steps = [
  "Generating ZK Proof...",
  "Verifying with zkVerify network...",
  "Settling on Horizen L3...",
  "Transaction Complete!"
];

const TransactionStatusModal: React.FC<TransactionStatusModalProps> = ({ details, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // Simulate 2-second delay for each step
      return () => clearTimeout(timer);
    }
  }, [currentStep]);
  
  const isComplete = currentStep === steps.length - 1;

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
        <h2 className="text-center text-2xl uppercase font-bold text-white mb-6">Processing Transaction</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              text={step} 
              isActive={index <= currentStep} 
              isComplete={index < currentStep || isComplete} 
            />
          ))}
        </div>

        {isComplete && (
          <div className="mt-8">
            <BlockyButton 
              onClick={onClose} 
              color="blue"
              className="w-full bg-mc-gradient hover:shadow-mc-glow"
            >
              Close
            </BlockyButton>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

interface StepProps {
  text: string;
  isActive: boolean;
  isComplete: boolean;
}

const Step: React.FC<StepProps> = ({ text, isActive, isComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg border border-indigo-500/20 shadow-block"
    >
      {isComplete ? (
        <CheckCircle className="text-emerald-400" size={24} />
      ) : isActive ? (
        <Loader className="text-indigo-400 animate-spin" size={24} />
      ) : (
        <div className="w-6 h-6 border-2 border-indigo-500/30 rounded-full" />
      )}
      <span className="text-base text-indigo-200 font-semibold">{text}</span>
    </motion.div>
  );
};

export default TransactionStatusModal;
