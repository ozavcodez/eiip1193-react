import React, { useState, useEffect, useCallback } from 'react';
import useWalletConnection from './hooks/useWalletConnection';

const WalletConnector = () => {
  const {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
    getAddressBalance
  } = useWalletConnection();

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);

  const handleAddressChange = useCallback((e) => {
    setAddress(e.target.value);
  }, []);

  const fetchBalance = useCallback(async () => {
    if (address) {
      const bal = await getAddressBalance(address);
      setBalance(bal !== null ? bal.toFixed(4) : null);
    } else {
      setBalance(null);
    }
  }, [address, getAddressBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, chainId]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Wallet Connector</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <div className="mb-6">
        {isConnected ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Connected Account:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{account}</p>
            <p className="text-sm text-gray-600">Network ID: <span className="font-semibold">{chainId}</span></p>
            <button 
              onClick={disconnectWallet}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Connect Wallet
          </button>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Check Address Balance</h2>
        <input
          type="text"
          placeholder="Enter Ethereum address"
          value={address}
          onChange={handleAddressChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={fetchBalance}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          Get Balance
        </button>
        
        {balance !== null && (
          <p className="mt-4 text-center text-lg font-semibold text-gray-800">
            Balance: <span className="text-green-600">{balance} ETH</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletConnector;