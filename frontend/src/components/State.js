import React from "react";
import Resources from "./Resources";
import ModeSwitch from "./ModeSwitch";
import SimulationState from "./SimulationState";

const State = ({
  upload,
  isSimulation,
  toggleSimulation,
  setSimulationResources,
  balance,
  simulate,
}) => {
  const startSimulation = () => {
    toggleSimulation();
    setSimulationResources([]);
  };

  return (
    <div className="state-container">
      <div className="title">State</div>
      <div className="state-item resources">
        <div className="row-title">
          Mode: {isSimulation ? "Building" : "Production"}
        </div>
        <ModeSwitch
          simulation={isSimulation}
          startSimulation={startSimulation}
          stopSimulation={toggleSimulation}
        />
      </div>
      <div className="state-item resources">
        <div className="row-title">Resources</div>
        <Resources state={balance} />
      </div>
      {isSimulation && (
        <SimulationState
          upload={upload}
          toggleSimulation={toggleSimulation}
          simulate={simulate}
        />
      )}
    </div>
  );
};

export default State;
