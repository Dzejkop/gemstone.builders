import React, { useState, useEffect } from "react";
import Resources from "./Resources";
import { Play, Stop, Upload } from "./Element";
import ModeSwitch from "./ModeSwitch";

import API from "../api";

const State = ({newGameState, resources, setMode, setSimulationResources}) => {
    const [simulationRunning, setSimulationRunning] = useState(null);
    const [steps, setSteps] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    console.log("State", newGameState);

    const startSimulation = () => {
        setSimulationRunning(true);
        setMode("simulation");
    }

    const stopSimulation = () => {
        setSimulationRunning(false);
        setMode("chain");
        setSteps(0);
    }

    const runSimulationStep = () => {
        setSteps(steps + 1);
    }

    useEffect(() => {
        if (!simulationRunning) { return; }

        const sym = async () => {
            
            const newState = await API.simulate(newGameState);
            setSimulationResources(newState.resourceState);
        };
        sym();
    }, [steps]);


    const upload = () => {
        if (submitted) {
            return;
        }

        API.submitBoard(newGameState.board);
        setSubmitted(true);
    }

    return (
        <div className="state-container">
            <div className="title">State</div>
            <div className="state-item resources">
                Mode: {simulationRunning ? "Simulation" : "On-Chain"}
                <ModeSwitch simulation={simulationRunning} startSimulation={startSimulation} stopSimulation={stopSimulation} />
            </div>
            <div className="state-item resources">
                <div className="row-title">Resources</div>
                <Resources state={resources} />
            </div>
            {simulationRunning && (
                <div className="state-item simulation">
                    <div className="row-title">Simulate factory work</div>
                    <Play displayName={true} onClick={runSimulationStep} />
                    <Stop displayName={true} onClick={stopSimulation} />
                    <div>Steps: {steps}</div>
                </div>
            )}
            {!simulationRunning && (
                <div className="state-item upload">
                    <div className="row-title">Run on chain</div>
                    <Upload disabled onClick={upload}/>
                </div>
            )}  
        </div>
    );  
}

export default State;
