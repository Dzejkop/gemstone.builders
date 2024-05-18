import React from "react";
import {
  MetaMaskButton,
  useAccount,
  useSDK,
} from "@metamask/sdk-react-ui";
import "./App.css";
import NotConnected from "./components/NotConnected";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import Footer from "./components/Footer";
import { UserContext } from "./UserContext";

function AppReady() {
  const { isConnected, address } = useAccount();

  return (
    <UserContext.Provider value={{ userAddress: address }}>
      <div className="App">
        {!isConnected && <NotConnected />
        }
        {isConnected && (<>
          <Header/>
          <MainGrid/>
          <Footer/>
        </>)}
      </div>
    </UserContext.Provider>
  );
}

function App() {
  const { ready } = useSDK();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return <AppReady />;
}

export default App;
