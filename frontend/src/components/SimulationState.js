import React, { useState } from "react";
import { Play, Stop, Upload } from "./Element";

const SimulationState = ({ upload, toggleSimulation, simulate }) => {
  const [steps, setSteps] = useState(0);

  const runSimulationStep = () => {
    setSteps(steps + 1);
    simulate();
  };

  const uploadAndProduce = () => {
    upload();
    toggleSimulation();
  };

  return (
    <div>
      <div className="state-item simulation">
        <div className="row-title">Simulate factory work</div>
        <Play displayName={true} onClick={runSimulationStep} />
        <Stop displayName={true} onClick={toggleSimulation} />
        <div className="row-title">Steps: {steps}</div>
      </div>
      <div className="state-item upload">
        <div className="row-title">Run on chain</div>
        <Upload disabled onClick={uploadAndProduce} />
      </div>
    </div>
  );
};

export default SimulationState;
