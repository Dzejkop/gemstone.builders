import React from 'react';

export const Element = ({ top, left, name, displayName, onClick, classes, disabled }) => {
  const imageUrl = 'elements.png'
  const width = 90;
  const height = 90;

  let classNames = classes ? `element-container ${classes}` : "element-container";
  classNames = disabled ? `${classNames} disabled` : classNames;


  return (
    <div className={classNames} onClick={onClick}>
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
export const Factory = ({displayName, onClick = () => {}, classes = ""}) => <Element top={90} left={180} name="Factory" displayName={displayName} onClick={onClick} classes={classes}/>
export const Belt = ({displayName, onClick = () => {}, classes = ""}) => <Element top={446} left={631} name="Belt down" displayName={displayName} onClick={onClick} classes={classes} />
export const Mine = ({displayName, onClick = () => {}, classes = ""}) => <Element top={178} left={270} name="Mine" displayName={displayName} onClick={onClick} classes={classes} />
export const Exporter = ({displayName, onClick = () => {}, classes = ""}) => <Element top={0} left={810} name="Exporter" displayName={displayName} onClick={onClick} classes={classes} />
export const Coal = ({displayName, onClick = () => {}, classes = ""}) => <Element top={543} left={0} name="Coal" displayName={displayName} onClick={onClick} classes={classes} />
export const Diamond = ({displayName, onClick = () => {}, classes = ""}) => <Element top={634} left={0} name="Diamond" displayName={displayName} onClick={onClick} classes={classes} />
export const Empty = ({displayName, onClick = () => {}, classes = ""}) => <Element top={514} left={800} name="Erase" displayName={displayName} onClick={onClick} classes={`blank ${classes}`} />

// controls
export const Play = ({displayName, onClick = () => {}, classes = ""}) => <Element top={361} left={538} name="Next production step" displayName={displayName} onClick={onClick} classes={classes} />
export const Stop = ({displayName, onClick = () => {}, classes = ""}) => <Element top={809} left={362} name="Reset" displayName={displayName} onClick={onClick} classes={classes} />
export const Upload = ({displayName, onClick = () => {}, classes = ""}) => <Element top={92} left={721} name="Upload" displayName={displayName} onClick={onClick} classes={classes} />
export const StartSimulation = ({displayName, onClick = () => {}, classes = ""}) => <Element top={361} left={268} name="Building mode" displayName={displayName} onClick={onClick} classes={classes} />
export const StopSimulation = ({displayName, onClick = () => {}, classes = ""}) => <Element top={270} left={268} name="Production mode" displayName={displayName} onClick={onClick} classes={classes} />
