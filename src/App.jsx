import React from 'react';
import WalletConnector from './component/WalletConnector';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <WalletConnector/>
      </div>
    </WalletProvider>
  );
}

export default App;