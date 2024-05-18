import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Resources from "./Resources";
import { Play, Stop, Upload } from "./Element";

import API from "../api";

const State = ({newGameState, resources}) => {
    const [simulationRunning, setSimulationRunning] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const startSimulation = () => {
        setSimulationRunning(true);
    }

    console.log(simulationRunning);

    useEffect(() => {
        const sym = async () => {
            if (simulationRunning === null || !simulationRunning) { return; }

            const newState = await API.simulate(newGameState);
            console.log(newState);
            // Update resource counters
            setSimulationRunning(false);
          };
        sym();
    }, [simulationRunning, newGameState]);


    const upload = () => {
        console.log("dddd");
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
                <div className="row-title">Resources</div>
                <Resources state={resources} />
            </div>
            <div className="state-item simulation">
                <div className="row-title">Simulate factory work</div>
                {!simulationRunning && <Play displayName={true} onClick={startSimulation} />}
                {simulationRunning && <Loader />}
                <Stop displayName={true} onClick={() => setSimulationRunning(false)} />
            </div>
            <div className="state-item upload">
                <div className="row-title">Run on chain</div>
                <Upload disabled onClick={upload}/>
            </div>
        </div>
    );  
}

export default State;
