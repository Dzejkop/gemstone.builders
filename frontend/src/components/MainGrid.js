import React from "react";
import Grid from "./Grid";
import { Belt, Factory, Mine, Exporter, Coal, Diamont } from "./Element";

function MainGrid() {
  return (
    <div className="main-container">
      <div className="column">
        <Grid />
      </div>
      <div className="column">
        Controls
        <Factory />
        <Belt />
        <Mine />
        <Exporter />
        <Coal />
        <Diamont />
      </div>
    </div>
    );  
}

export default MainGrid;
