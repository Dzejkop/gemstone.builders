import React from 'react';
import consts from '../consts';

const Resources = ({state}) => {
  const renderResources = () => {
    return Object.keys(consts.RESOURCES).map((index) => {
      const Resource = consts.RESOURCES[index];

      const amount = state && state[index] !== undefined ? state[index] : 0;
      return (
        <div>
          <Resource key={index} displayName={true} />
          <div className="resource-amount">{amount}</div>
        </div>
      );
    });
  }

  return (
    <div className="resources-container">
      {renderResources()}
    </div>
  );
}

export default Resources;
