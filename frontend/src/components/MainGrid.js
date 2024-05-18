import React, { useState, useEffect } from "react";
import BuildingGrid from "./BuildingGrid";
import ResourceGrid from "./ResourceGrid";
import ControlPanel from "./ControlPanel";
import ClickableGrid from "./ClickableGrid";
import State from "./State";
import Loader from "./Loader";
import { Coal, Diamond } from "./Element";

import API from "../api";

const MainGrid = ({mode, setMode}) => {
  const [state, setState] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [newBoard, setNewBoard] = useState(null);
  const [simulationResources, setSimulationResources] = useState([]);
  const [intervalCall, setIntervalCall] = useState(null);

  const isSimulation = mode === "simulation";

  const selectBuilding = (index) => {
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

    const update = [...newBoard];
    update[row][col] = parseInt(selectedBuilding);

    setNewBoard(update);
  }

  const updateData = async () => {
    const state = await API.getBoard();
    setState(state);
    setNewBoard(state.board);
  }

  useEffect(() => {
    if (isSimulation) {
      clearInterval(intervalCall);
      setIntervalCall(null);
    } else {
    const intervalID = setInterval(() => {
      updateData();
    }, 3000);

    setIntervalCall(intervalID)

    return () => {
      clearInterval(intervalID);
    };
  }
}, [isSimulation]);


  const renderResources = () => {
    const data = mode === "chain" ? state.resourceState : simulationResources;
    return data.map((resourceGrid, index) => {
      const component = index === 0 ? Coal : Diamond;
      return <ResourceGrid className="resources" items={resourceGrid} component={component} />
    });
  ;}

  const newGameState = state === null ? null : {
    board: newBoard,
    resourceState: isSimulation && simulationResources.length > 0 ? simulationResources : state.resourceState,
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
        {isSimulation && <ControlPanel selectedBuilding={selectedBuilding} selectBuilding={selectBuilding}/>}
      </div>
      <div className="column">
        <State newGameState={newGameState} setMode={setMode} setSimulationResources={setSimulationResources} />
      </div>
    </div>
    );  
}

export default MainGrid;
