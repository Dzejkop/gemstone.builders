import React from "react";
import Grid from "./Grid";
import ControlPanel from "./ControlPanel";
import State from "./State";

function MainGrid() {
  return (
    <div className="main-container">
      <div className="column">
        Factory
        <div className="board">
          <Grid className="fields" />
          <Grid className="resources"/>
        </div>
        <ControlPanel />
      </div>
      <div className="column">
        <State />
      </div>
    </div>
    );  
}

export default MainGrid;
