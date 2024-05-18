import React from "react";
import Grid from "./Grid";
import ControlPanel from "./ControlPanel";
import State from "./State";

const buildings = [[0, 1, 0, 0, 0], [0, 2, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
const resources = [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];

function MainGrid() {
  return (
    <div className="main-container">
      <div className="column">
        Factory
        <div className="board">
          <Grid className="fields" items={buildings} type="buildings" />
          <Grid className="resources" items={resources} type="resources" />
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
