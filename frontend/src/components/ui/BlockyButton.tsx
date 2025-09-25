import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';

interface BlockyButtonProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  color?: 'green' | 'red' | 'blue' | 'stone';
  className?: string;
}

export const BlockyButton: FC<BlockyButtonProps> = ({
  onClick,
  children,
  disabled = false,
  color = 'stone',
  className = '',
}) => {
  const colorClasses = {
    green: 'bg-mc-green text-white',
    red: 'bg-mc-red text-white',
    blue: 'bg-mc-blue text-white',
    stone: 'bg-mc-stone text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-3 uppercase font-bold border-2 border-black/50
                  ${colorClasses[color]} 
                  ${!disabled ? 'shadow-block hover:shadow-block-hover active:shadow-block-inset' : 'opacity-50 cursor-not-allowed'}
                  ${className}`}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { y: 1 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};
