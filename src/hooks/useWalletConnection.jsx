import { useState, useEffect, useCallback } from 'react';

const useWalletConnection = () => {
  const [ethereum, setEthereum] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setEthereum(window.ethereum);
        setAccount(accounts[0]);
        setChainId(parseInt(chainId, 16));
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
    setEthereum(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  }, []);

  const getAddressBalance = useCallback(async (address) => {
    if (ethereum) {
      try {
        const balance = await ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        return parseInt(balance, 16) / 1e18; // Convert from wei to ETH
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        return null;
      }
    }
    return null;
  }, [ethereum]);

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
    ethereum,
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