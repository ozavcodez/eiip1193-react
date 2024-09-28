import React, { useState, useEffect, useCallback } from 'react';
import useWalletConnection from './hooks/useWalletConnection';

function App() {
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
      setBalance(bal);
    } else {
      setBalance(null);
    }
  }, [address, getAddressBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, chainId]);
  return (
    <div>
      <h1>Wallet Connector</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {isConnected ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Network ID: {chainId}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      
      <h2>Check Address Balance</h2>
      <input
        type="text"
        placeholder="Enter Ethereum address"
        value={address}
        onChange={handleAddressChange}
      />
      <button onClick={fetchBalance}>Get Balance</button>
      
      {balance !== null && (
        <p>Balance: {balance} ETH</p>
      )}
    </div>
  );
}

export default App
