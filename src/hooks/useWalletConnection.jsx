import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const useWalletConnection = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setAccount(accounts[0]);
        setChainId(network.chainId);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Failed to connect wallet');
        console.error(err);
      }
    } else {
      setError('Please install MetaMask');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  }, []);

  const getAddressBalance = useCallback(async (address) => {
    if (provider && ethers.utils.isAddress(address)) {
      try {
        const balance = await provider.getBalance(address);
        return ethers.utils.formatEther(balance);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        return null;
      }
    }
    return null;
  }, [provider]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account, disconnectWallet]);

  return {
    provider,
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
    getAddressBalance
  };
};

export default useWalletConnection;