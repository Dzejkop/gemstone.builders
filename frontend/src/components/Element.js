import React from 'react';

export const Element = ({ top, left, name, displayName, onClick, classes, disabled, tooltip, takes = "", outputs = "" }) => {
  const imageUrl = 'elements.png'
  const width = 90;
  const height = 90;

  let classNames = classes ? `element-container ${classes}` : "element-container";
  classNames = disabled ? `${classNames} disabled` : classNames;
  classNames = (tooltip !== undefined) ? `${classNames} tooltip` : classNames;

  const tooltipContent = () => {
    const takes_t = (takes && takes.length > 0) ? `takes: ${takes} <br/>` : "";
    const outputs_t = (outputs && outputs.length > 0) ? `outputs: ${outputs}` : "";
    return (<span class="tooltiptext">
        <div dangerouslySetInnerHTML={{ __html: takes_t }} />
        <div dangerouslySetInnerHTML={{ __html: outputs_t }} />
    </span>)
  }

  return (
    <div className={classNames} onClick={onClick}>
      {tooltip && tooltipContent()}
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
export const Mine = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={178} left={270} name="Mine" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} outputs="1 coal" />
export const Factory = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={90} left={180} name="Factory" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} takes="2 coal" outputs="1 diamond"/>
export const DiamondImporter = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={180} left={631} name="Diamond Importer" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} outputs="1 diamond" />
export const Exporter = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={0} left={810} name="Exporter" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} takes="1 any" />
export const BeltRight = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={360} left={541} name="Belt right" displayName={displayName} onClick={onClick} classes={classes} />
export const BeltDown = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={446} left={631} name="Belt down" displayName={displayName} onClick={onClick} classes={classes} />
export const BeltLeft = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={542} left={541} name="Belt left" displayName={displayName} onClick={onClick} classes={classes} />
export const BeltUp = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={446} left={451} name="Belt up" displayName={displayName} onClick={onClick} classes={classes} />
export const DiamondChipper = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={178} left={360} name="Diamond Chipper" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} takes="2 coal, 1 diamond" outputs="1 coal, 2 diamond" />
export const Burner = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={180} left={541} name="Burner" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} takes="1 any" />

export const Coal = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={543} left={0} name="Coal" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
export const Diamond = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={634} left={0} name="Diamond" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />

export const Empty = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={514} left={800} name="Erase" displayName={displayName} onClick={onClick} classes={`blank ${classes}`} tooltip={false} />

// controls
export const Play = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={361} left={538} name="Next production step" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
export const Stop = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={809} left={362} name="Reset" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
export const Upload = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={92} left={721} name="Upload" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
export const StartSimulation = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={361} left={268} name="Building mode" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
export const StopSimulation = ({displayName, onClick = () => {}, classes = "", tooltip}) => <Element top={270} left={268} name="Production mode" displayName={displayName} onClick={onClick} classes={classes} tooltip={tooltip} />
