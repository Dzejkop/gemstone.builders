import React from 'react';
import { Empty } from "./Element";

const ResourceGrid = ({items, component}) => {
  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const index = items[row][col];
        const ComponentToRender = index === 0 ? Empty : component;

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

export default ResourceGrid;
