import React from 'react';
import { Belt, Factory, Mine, Exporter, Coal, Diamond, Empty } from "./Element";
import consts from "../consts";

const Grid = ({items, type}) => {
  const handleClick = (row, col) => {
    console.log(`Row: ${row}, Column: ${col}`);
  };

  const elements = [Belt, Factory, Mine, Exporter, Coal, Diamond, Empty ];
  const buildings = {
    [consts.EMPTY]: Empty,
    [consts.MINE]: Mine,
    [consts.BELT_DOWN]: Belt,
    [consts.EXPORTER]: Exporter,
  }

  const resources = {
    [consts.EMPTY]: Empty,
    [consts.CARBON]: Coal,
    [consts.DIAMOND]: Diamond,
  }

  const renderGrid = () => {
    const elements = type == "buildings" ? buildings : resources;

    const grid = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const index = items[row][col];
        const ComponentToRender = elements[index];

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
