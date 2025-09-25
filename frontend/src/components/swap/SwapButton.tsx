import { motion } from 'framer-motion'
import type { FC } from 'react'; 

interface SwapButtonProps {
  onClick: () => void;
}

export const SwapButton: FC<SwapButtonProps>  = ({ onClick }) => {
  return (
    <motion.button
    onClick={onClick}
      className="w-full py-4 bg-gradient-to-r from-brand-pink to-brand-purple rounded-2xl text-lg font-bold text-white"
      whileHover={{ scale: 1.02, boxShadow: '0px 0px 20px rgba(245, 83, 164, 0.5)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      Review Swap
    </motion.button>
  )
}
