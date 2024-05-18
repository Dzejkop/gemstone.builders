import React, { useState, useEffect } from "react";
import BuildingGrid from "./BuildingGrid";
import ResourceGrid from "./ResourceGrid";
import ControlPanel from "./ControlPanel";
import ClickableGrid from "./ClickableGrid";
import State from "./State";
import Loader from "./Loader";
import { Coal, Diamond } from "./Element";

import API from "../api";

const MainGrid = () => {
  const [state, setState] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [newBoard, setNewBoard] = useState(null);

  const selectBuilding = (index) => {
    console.log(index);
    if (index === selectedBuilding) {
      setSelectedBuilding(null)
    } else {
      setSelectedBuilding(index)
    }
  };
  
  const build = (row, col) => {
    if (selectedBuilding === null) {
      return;
    }

    const update = {...newBoard}
    update[row][col] = selectedBuilding;

    setNewBoard(update);
  }

  useEffect(() => {
    const getBoard = async () => {
      const state = await API.getBoard();
      setState(state);
      setNewBoard(state.board);
    };

    getBoard();
  }, []);

  const renderResources = () => {
    const simulated_resources = [
      [[0, 0, 0, 0, 1],[0, 0, 0, 0, 1],[0, 0, 0, 0, 1],[0, 0, 0, 0, 1],[0, 0, 0, 0, 1]],
      [[0, 0, 0, 1, 0],[0, 0, 0, 1, 0],[0, 0, 0, 1, 0],[0, 0, 0, 1, 0],[0, 0, 0, 1, 0]]
    ];
    return state.resourceState.map((resourceGrid, index) => {
      const component = index === 0 ? Coal : Diamond;
      return <ResourceGrid className="resources" items={resourceGrid} component={component} />
    });
  ;}

  const newGameState = state === null ? null : {
    board: newBoard,
    resourceState: state.resourceState
  }

  return (
    <div className="main-container">
      <div className="column">
        Factory

        {state === null && <Loader />}
        {state !== null && (
          <div className="board">
            <BuildingGrid className="fields" items={state.board} type="buildings" />
            {renderResources()}
            <ClickableGrid build={build} />
          </div>
        )}
        <ControlPanel selectedBuilding={selectedBuilding} selectBuilding={selectBuilding} />
      </div>
      <div className="column">
        <State newGameState={newGameState} />
      </div>
    </div>
    );  
}

export default MainGrid;
