// src/App.tsx

import { Suspense, useState } from 'react';
import { WalletProvider } from './components/contexts/WalletContext';
import TradingPage from './pages/TradingPage';
import MinecraftWorld from './components/world/MinecraftWorld';

function App() {
  // We lift the state up to the App component
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <WalletProvider>
      {/* UI Layer */}
      <div className="relative z-10 pointer-events-none">
        {/* Pass the state and the setter function to the UI */}
        <TradingPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      {/* 3D Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Suspense fallback={null}>
          {/* Pass the state to the 3D world to control the blur */}
          <MinecraftWorld isModalOpen={isModalOpen} />
        </Suspense>
      </div>
    </WalletProvider>
  );
}

export default App;