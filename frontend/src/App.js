import React, { useState } from "react";
import {
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
  const [ mode, setMode ] = useState("chain");

  let classes = "App";
  if (mode === "simulation") {
    classes = `${classes} simulation`;
  }

  return (
    <UserContext.Provider value={{ userAddress: address }}>
      <div className={classes}>
        {!isConnected && <NotConnected />
        }
        {isConnected && (<>
          <Header/>
          <MainGrid mode={mode} setMode={setMode}/>
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
