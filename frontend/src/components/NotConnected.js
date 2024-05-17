import React from "react";
import {
    MetaMaskButton,
  } from "@metamask/sdk-react-ui";

function NotConnected() {
    return (
        <header className="App-header">
            <div className="subtitle">Connect to play</div>
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        </header>
    );  
}

export default NotConnected;
