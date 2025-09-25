import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import baseIcon from "../../assets/baseicon.jpeg";
import polkadotIcon from "../../assets/polkadot.png"; 
import type { Chain } from './SwapPageController';

interface RouteSelectorProps {
  onRouteSelect: (from: Chain, to: Chain) => void;
}

const chainOptions: { id: Chain; name: string; icon: string }[] = [
  { id: 'base', name: 'Base', icon: baseIcon },
  { id: 'horizen', name: 'Horizen', icon: polkadotIcon },
];

export const RouteSelector: React.FC<RouteSelectorProps> = ({ onRouteSelect }) => {
  const [from, setFrom] = useState<Chain>(null);
  const [to, setTo] = useState<Chain>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (chain: Chain, type: 'from' | 'to') => {
    setError(null);
    if (type === 'from') setFrom(chain);
    if (type === 'to') setTo(chain);
  };
  
  const handleConfirm = () => {
    if (from === 'horizen' && to === 'horizen') {
      setError('Cross chain bridge so select different chains.');
      return;
    }
    if (from === 'base' && to === 'base') {
      setError('Cross chain bridge so select different chains.');
      return;
    }
    if (from && to) {
      onRouteSelect(from, to);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-bg-card backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
    >
      <h2 className="text-xl font-bold text-white mb-4 text-center">Select Swap Route</h2>
      <div className="flex items-center justify-around gap-4">
        {/* From Chain */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold text-white/70">From</span>
          {chainOptions.map(chain => (
            <ChainButton key={chain.id} chain={chain} selected={from === chain.id} onClick={() => handleSelect(chain.id, 'from')} />
          ))}
        </div>

        <ArrowRight className="text-white/30" size={24} />

        {/* To Chain */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold text-white/70">To</span>
          {chainOptions.map(chain => (
            <ChainButton key={chain.id} chain={chain} selected={to === chain.id} onClick={() => handleSelect(chain.id, 'to')} />
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-xs text-center mt-4">{error}</p>}
      
      <motion.button
        onClick={handleConfirm}
        disabled={!from || !to}
        className="w-full mt-6 py-3 bg-gradient-to-r from-brand-pink to-brand-purple rounded-2xl text-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

const ChainButton = ({ chain, selected, onClick }: { chain: any, selected: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`relative w-28 p-3 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${selected ? 'border-brand-pink' : 'border-white/10 hover:border-white/30'}`}>
    {selected && <div className="absolute top-1 right-1 bg-brand-pink rounded-full p-0.5"><Check size={10} /></div>}
    <img src={chain.icon} alt={chain.name} className="w-8 h-8 rounded-full" />
    <span className="text-sm font-semibold text-white">{chain.name}</span>
  </button>
);
