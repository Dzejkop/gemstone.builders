import React from 'react';
import { Diamond } from './Element';

const Loader = () => {
  return (
    <div className="rotating-image-container">
        <div className="rotating-image">
            <Diamond />
        </div>
    </div>
  );
};

export default Loader;
