import React, { useState, createContext } from "react";
import { useAccount, useSDK } from "@metamask/sdk-react-ui";
import "./App.css";
import NotConnected from "./components/NotConnected";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import Footer from "./components/Footer";
import { UserContext } from "./UserContext";

const SimulationContext = createContext(false);

function AppReady() {
  const { isConnected, address } = useAccount();
  const [isSimulation, setSimulationState] = useState(false);

  let classes = "App";
  if (isSimulation) {
    classes = `${classes} simulation`;
  }

  return (
    <UserContext.Provider value={{ userAddress: address }}>
      <SimulationContext.Provider value={isSimulation}>
        <div className={classes}>
          {!isConnected && <NotConnected />}
          {isConnected && (
            <>
              <Header />
              <MainGrid
                isSimulation={isSimulation}
                setSimulationState={setSimulationState}
              />
              <Footer />
            </>
          )}
        </div>
      </SimulationContext.Provider>
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
