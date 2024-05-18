import React from "react";
import {
    MetaMaskButton,
  } from "@metamask/sdk-react-ui";

function NotConnected() {
    return (
        <header className="App-header">
            <img src="logo64.png" width={256} className="App-logo" alt="logo" />
            <div className="title">Gamestone Builders</div>
            <div className="subtitle">A resource gathering game with a ZK engine and on-chain global economy</div>
            <a href="https://github.com/Dzejkop/gemstone.builders">
                <img src="github-mark-white.png" width={128} className="gh-logo" />
                <div className="no-decoration white subtitle">Check out the Code!</div>
            </a>

            <div>Connect to play</div>
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        </header>
    );
}

export default NotConnected;
