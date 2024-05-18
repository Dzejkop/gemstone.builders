import React from 'react';

export const Element = ({ top, left, name, displayName, onClick }) => {
  const imageUrl = 'elements.png'
  const width = 90;
  const height = 90;

  return (
    <div className="element-container" onClick={onClick}>
      <img src={imageUrl} alt="Sprites" className="base-image" />
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
      
      {displayName && <div className="element-name">{name}</div>}
    </div>
  );
};

// grid
export const Factory = ({displayName, onClick}) => <Element top={90} left={180} name="Factory" displayName={displayName} onClick={onClick} />
export const Belt = ({displayName, onClick}) => <Element top={446} left={631} name="Belt down" displayName={displayName} onClick={onClick} />
export const Mine = ({displayName, onClick}) => <Element top={178} left={270} name="Mine" displayName={displayName} onClick={onClick} />
export const Exporter = ({displayName, onClick}) => <Element top={0} left={810} name="Exporter" displayName={displayName} onClick={onClick} />
export const Coal = ({displayName, onClick}) => <Element top={543} left={0} name="Coal" displayName={displayName} onClick={onClick} />
export const Diamond = ({displayName, onClick}) => <Element top={634} left={0} name="Diamond" displayName={displayName} onClick={onClick} />
export const Empty = () => <div />

// controls
export const Play = ({displayName, onClick}) => <Element top={270} left={268} name="Play" displayName={displayName} onClick={onClick} />
export const Stop = ({displayName, onClick}) => <Element top={809} left={362} name="Stop" displayName={displayName} onClick={onClick} />
export const Upload = ({displayName, onClick}) => <Element top={92} left={721} name="Upload" displayName={displayName} onClick={onClick} />
