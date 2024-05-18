import React from "react";
import consts from "../consts";

const ControlPanel = ({selectedBuilding, selectBuilding}) => {
  const renderBuildings = () => {
    return Object.keys(consts.BUILDINGS).map((index) => {
      const classes = selectedBuilding === index ? "selected" : "";

      const Building = consts.BUILDINGS[index];
      return <Building key={index} displayName={true} onClick={() => selectBuilding(index)} classes={classes} />;
    });
  };

  return (
    <div className="control-panel">
      <div>Build</div>
      {renderBuildings()}
    </div>
  );
}

export default ControlPanel;
