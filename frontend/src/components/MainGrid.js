import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import ControlPanel from "./ControlPanel";
import State from "./State";

import API from "../api";

const buildings = [[0, 1, 0, 0, 0], [0, 2, 0, 0, 0], [0, 3, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
const resources = [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];

const MainGrid = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const getBoard = async () => {
      const state = await API.getBoard();
      setBoard(state);
    };

    getBoard();
  }, []);

  console.log(board);

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
