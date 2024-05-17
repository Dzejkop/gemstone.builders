import React from 'react';

export const Element = ({ top, left }) => {
  const imageUrl = 'elements.png'
  const width = 90;
  const height = 90;

  return (
    <>
      <img src={imageUrl} alt="Descriptive" className="base-image" />
      <div
        className="image-element"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `-${left}px -${top}px`,
        }}
      >
      </div>
    </>
  );
};

export const Factory = () => <Element top={90} left={180}/>
export const Belt = () => <Element top={446} left={631}/>
export const Mine = () => <Element top={178} left={270}/>
export const Exporter = () => <Element top={0} left={810}/>
export const Coal = () => <Element top={543} left={0}/>
export const Diamont = () => <Element top={634} left={0}/>
