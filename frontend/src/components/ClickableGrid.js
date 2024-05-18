import React from 'react';
import { Empty } from "./Element";

const ClickableGrid = ({build}) => {
  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        grid.push(
          <div
            key={`${col}-${row}`}
            className="grid-item"
            onClick={() => build(row, col)}
          >
            <Empty />
          </div>
        );
      }
    }
    return grid;
  };

  return <div className="grid-container clickable">{renderGrid()}</div>;
};

export default ClickableGrid;
