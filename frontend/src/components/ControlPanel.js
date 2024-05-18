import React from "react";
import { Belt, Factory, Mine, Exporter } from "./Element";

const ControlPanel = () => (
    <div className="control-panel">
        <div>Controls</div>
        <Factory displayName={true} />
        <Belt displayName={true} />
        <Mine displayName={true} />
        <Exporter displayName={true} />
    </div>
)


export default ControlPanel;
