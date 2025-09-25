import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import type { ChainId } from '../../config/wagmi';
import type { Signer } from 'ethers';
import { ethers } from 'ethers';

interface WalletContextState {
  address?: `0x${string}`;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => void;
  disconnect: () => void;
  switchChain: (chainId: ChainId) => void;
  isSwitching: boolean;
  chainId?: number;
  evmSigner: Signer | null;
}

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected: wagmiIsConnected, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [evmSigner, setEvmSigner] = useState<Signer | null>(null);

  const isConnected = wagmiIsConnected && !!address;
  useEffect(() => {
    const getSigner = async () => {
      if (connector) {
        try {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await ethersProvider.getSigner();
          setEvmSigner(signer);
        } catch (error) {
            console.error("Failed to create ethers signer:", error);
            setEvmSigner(null);
        }
      } else {
        setEvmSigner(null);
      }
    };

    getSigner();
  }, [connector]);

  const connectWallet = useCallback(() => {
    if (isConnecting || isConnected) {
      console.log('Connect skipped: already connecting or connected');
      return;
    }

    const metaMaskConnector = connectors.find((c) => c.id === 'metaMask');
    if (metaMaskConnector) {
      console.log('Connecting with MetaMask connector:', metaMaskConnector);
      connect({ connector: metaMaskConnector });
    } else {
      console.error('MetaMask connector not found. Available connectors:', connectors);
      alert('Please install MetaMask to connect your wallet.');
    }
  }, [connect, connectors, isConnecting, isConnected]);

  const handleSwitchChain = useCallback(
    (chainId: ChainId) => {
      if (!switchChain) {
        console.error('SwitchChain function is undefined. Check wagmi configuration.');
        return;
      }
      console.log('Switching to chain:', chainId);
      try {
        switchChain({ chainId });
      } catch (error) {
        console.error('Chain switch failed:', error);
        alert('Failed to switch chain. Please try again.');
      }
    },
    [switchChain]
  );

  const value: WalletContextState = {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect: () => {
      console.log('Disconnecting wallet');
      disconnect();
    },
    switchChain: handleSwitchChain,
    isSwitching,
    chainId: chain?.id,
    evmSigner, 
  };

  // Debugging logs
  console.log('WalletContext State:', {
    address,
    isConnected,
    isConnecting,
    chainId: chain?.id,
    isSwitching,
    connectors: connectors.map(c => c.id),
  });

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
