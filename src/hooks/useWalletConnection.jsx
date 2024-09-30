import React from 'react';
import { WalletProvider } from './context/WalletContext';
import WalletConnector from './components/WalletConnector';

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <WalletConnector />
      </div>
    </WalletProvider>
  );
}

export default App;