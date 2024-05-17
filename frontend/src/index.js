import React from 'react';
import ReactDOM from 'react-dom/client';
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import consts from './consts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskUIProvider
      debug={true}
      sdkOptions={{
        dappMetadata: {
          name: "ZK Hack Diamonds",
          url: window.location.href,
        },
        infuraAPIKey: consts.INFURE_API_KEY,
        defaultReadOnlyChainId: 11155111,
        preferDesktop: true,
      }}
    >
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
