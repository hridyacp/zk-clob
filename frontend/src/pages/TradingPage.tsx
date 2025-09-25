// src/pages/TradingPage.tsx

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/layouts/Header';
import TradingTerminal from '../components/trading/TradingTerminal';
import ReviewModal from '../components/trading/ReviewModal';
import TransactionStatusModal from '../components/trading/TransactionStatusModal';
import type { Chain } from '../config/wagmi';

export interface TradeDetails {
  tradeType: 'Trade';
  fromChain: Chain;
  toChain: Chain;
  fromAmount: string;
  toAmount: string;
}

// Accept the state and setter function as props
interface TradingPageProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

const TradingPage = ({ setIsModalOpen }: TradingPageProps) => {
  const [tradeDetails, setTradeDetails] = useState<TradeDetails | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // This useEffect will now notify the App component whenever a modal opens or closes
  useEffect(() => {
    setIsModalOpen(isReviewing || isProcessing);
  }, [isReviewing, isProcessing, setIsModalOpen]);


  const handleReview = (details: TradeDetails) => {
    setTradeDetails(details);
    setIsReviewing(true);
  };

  const handleConfirm = () => {
    setIsReviewing(false);
    setIsProcessing(true);
    contract.on("Swap", (sender, tx, event) => {
      console.log("Sender:", sender);
      console.log("Transaction:", tx);
      console.log("Event details:", event);
      const plaintext = crypto.privateDecrypt(
        { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
        Buffer.from(tx)
        );
        const order = JSON.parse(plaintext.toString());
        console.log("Decrypted order:", order);
        balances[sender][order.give] = balances[sender][order.give].sub(ethers.BigNumber.from(order.giveAmount));
        orderBook, balances = swap(orderBook, balances);
    });
    
  };

  const handleCloseProcessing = () => {
    setIsProcessing(false);
    setTradeDetails(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 text-white font-minecraft pointer-events-auto">
      <Header />
      <main className="flex-grow w-full flex items-center justify-center">
        <TradingTerminal onReview={handleReview} />
      </main>

      <AnimatePresence>
        {isReviewing && tradeDetails && (
          <ReviewModal
            details={tradeDetails}
            onClose={() => setIsReviewing(false)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProcessing && tradeDetails && (
          <TransactionStatusModal
            details={tradeDetails}
            onClose={handleCloseProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradingPage;
