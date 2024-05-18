import React, { useState, useEffect } from "react";
import Resources from "./Resources";
import { Play, Stop, Upload } from "./Element";
import ModeSwitch from "./ModeSwitch";

import API from "../api";

const State = ({upload, setMode, setSimulationResources, balance, simulate, fetchAndUpdate}) => {
    const [simulationRunning, setSimulationRunning] = useState(null);
    const [steps, setSteps] = useState(0);

    console.log("balance", balance);

    const startSimulation = () => {
        setSimulationRunning(true);
        setMode("simulation");
        setSimulationResources([]);
        setSteps(0);
    }

    const stopSimulation = () => {
        setSimulationRunning(false);
        setMode("chain");
        setSteps(0);
        fetchAndUpdate();
    }

    const runSimulationStep = () => {
        setSteps(steps + 1);
        simulate();
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
                <Resources state={balance} />
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
