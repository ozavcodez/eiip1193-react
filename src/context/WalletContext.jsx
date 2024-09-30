import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [ethereum, setEthereum] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [address, setAddress] = useState('');
  const [addressBalance, setAddressBalance] = useState(null);

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
    setAccountBalance(null);
  }, []);

  const getAddressBalance = useCallback(async (addr) => {
    if (ethereum) {
      try {
        const balance = await ethereum.request({
          method: 'eth_getBalance',
          params: [addr, 'latest']
        });
        return parseInt(balance, 16) / 1e18; // Convert from wei to ETH
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        return null;
      }
    }
    return null;
  }, [ethereum]);

  const handleAddressChange = useCallback((e) => {
    setAddress(e.target.value);
  }, []);

  const fetchAddressBalance = useCallback(async () => {
    if (address) {
      const bal = await getAddressBalance(address);
      setAddressBalance(bal !== null ? bal.toFixed(4) : null);
    } else {
      setAddressBalance(null);
    }
  }, [address, getAddressBalance]);

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

  useEffect(() => {
    if (isConnected && account) {
      getAddressBalance(account).then(bal => {
        setAccountBalance(bal !== null ? bal.toFixed(4) : null);
      });
    }
  }, [isConnected, account, getAddressBalance, chainId]);

  const value = {
    ethereum,
    account,
    chainId,
    isConnected,
    error,
    accountBalance,
    address,
    addressBalance,
    connectWallet,
    disconnectWallet,
    getAddressBalance,
    handleAddressChange,
    fetchAddressBalance
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};