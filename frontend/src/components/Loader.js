import React from 'react';
import { Diamond } from './Element';

const Loader = ({classes}) => {
  return (
    <div className="rotating-image-container">
        <div className="rotating-image">
            <Diamond classes={classes} />
        </div>
    </div>
  );
};

export default Loader;
