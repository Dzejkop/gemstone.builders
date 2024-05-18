import React from "react";
import {
    MetaMaskButton,
  } from "@metamask/sdk-react-ui";

function NotConnected() {
    return (
        <header className="App-header">
            <div className="title">Gamestone Builders</div>
            <div className="subtitle">A resource gathering game with a ZK engine and on-chain global economy</div>
            <div>Connect to play</div>
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        </header>
    );  
}

export default NotConnected;
