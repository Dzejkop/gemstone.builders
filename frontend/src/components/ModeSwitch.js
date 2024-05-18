import React from 'react';
import { StartSimulation, StopSimulation } from "./Element";

const ModeSwitch = ({simulation, startSimulation, stopSimulation}) => {
  return (
    <div className="mode-container">
      {!simulation && <StartSimulation displayName={true} onClick={startSimulation} />}
      {simulation && <StopSimulation displayName={true} onClick={stopSimulation} />}
    </div>
  );
}

export default ModeSwitch;
