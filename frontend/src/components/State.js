import React from "react";
import Loader from "./Loader";
import { Play, Stop, Upload } from "./Element";

function State() {
    return (
        <div className="state-container">
            <div>State</div>
            <div className="state-item simulation">
                <div className="row-title">Simulation</div>
                <Play displayName={true} />
                <Stop displayName={true} />
            </div>
            <div className="state-item upload"><div className="row-title ">Upload</div><Upload /></div>
            {/* <Loader /> */}
            
        </div>
    );  
}

export default State;
