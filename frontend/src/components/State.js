import React, { useState, useEffect } from "react";
import Resources from "./Resources";
import { Play, Stop, Upload } from "./Element";
import ModeSwitch from "./ModeSwitch";

import API from "../api";

const State = ({newGameState, setMode, setSimulationResources}) => {
    const [simulationRunning, setSimulationRunning] = useState(null);
    const [steps, setSteps] = useState(0);
    const [counts, setCounts] = useState([0, 0]);

    console.log("State", newGameState);

    const startSimulation = () => {
        setSimulationRunning(true);
        setMode("simulation");
        setSimulationResources([]);
        setSteps(0);
        setCounts([0, 0]);
    }

    const stopSimulation = () => {
        setSimulationRunning(false);
        setMode("chain");
        setSteps(0);
        setCounts([0, 0]);
        setSimulationResources([]);
    }

    const runSimulationStep = () => {
        setSteps(steps + 1);
    }

    useEffect(() => {
        if (!simulationRunning) { return; }

        const sym = async () => {
            
            const newState = await API.simulate(newGameState);

            console.log(newState);
            setSimulationResources(newState.newState.resourceState);
            const newCounts = newState.resourceOutput.map((item, index) => {
                return counts[index] + item;
            });
            setCounts(newCounts)
        };
        sym();
    }, [steps]);

    const upload = () => {
        API.submitBoard(newGameState.board);
    }

    return (
        <div className="state-container">
            <div className="title">State</div>
            <div className="state-item resources">
                Mode: {simulationRunning ? "Building" : "Production"}
                <ModeSwitch simulation={simulationRunning} startSimulation={startSimulation} stopSimulation={stopSimulation} />
            </div>
            <div className="state-item resources">
                <div className="row-title">Resources</div>
                <Resources state={counts} />
            </div>
            {simulationRunning && (
                <div className="state-item simulation">
                    <div className="row-title">Simulate factory work</div>
                    <Play displayName={true} onClick={runSimulationStep} />
                    <Stop displayName={true} onClick={stopSimulation} />
                    <div className="row-title">Steps: {steps}</div>
                </div>
            )}
            {simulationRunning && (
                <div className="state-item upload">
                <div className="row-title">Run on chain</div>
                <Upload disabled onClick={upload}/>
            </div>
            )}  
        </div>
    );  
}

export default State;
