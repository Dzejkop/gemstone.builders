import React from 'react';
import consts from "../consts";

const BuildingGrid = ({items, type}) => {

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const index = items[row][col];
        const ComponentToRender = consts.BUILDINGS[index];

        grid.push(
          <div
            key={`${col}-${row}`}
            className="grid-item"
          >
            <ComponentToRender />
          </div>
        );
      }
    }
    return grid;
  };

  return <div className="grid-container">{renderGrid()}</div>;
};

export default BuildingGrid;
