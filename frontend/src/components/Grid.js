import React from 'react';
import { Belt, Factory, Mine, Exporter, Coal, Diamond, Empty } from "./Element";

const Grid = () => {
  const handleClick = (row, col) => {
    console.log(`Row: ${row}, Column: ${col}`);
  };

  const elements = [Belt, Factory, Mine, Exporter, Coal, Diamond, Empty ];

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const randomIndex = Math.floor(Math.random() * elements.length);
        const ComponentToRender = elements[randomIndex];
        grid.push(
          <div
            key={`${col}-${row}`}
            className="grid-item"
            onClick={() => handleClick(row, col)}
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

export default Grid;
