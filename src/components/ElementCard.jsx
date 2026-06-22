import React, { memo } from 'react';

export const ElementCard = memo(function ElementCard({ 
  element, 
  row, 
  col, 
  difficulty = 'Beginner', 
  onClick, 
  onHoverGroup,
  isHighlighted,
  isDimmed
}) {
  const groupClass = typeof element.groupBlock === 'string' ? element.groupBlock.toLowerCase().replace(/\s+/g, '-') : '';
  const stateClass = typeof element.stateAtRoomTemp === 'string' ? `state-${element.stateAtRoomTemp.toLowerCase()}` : '';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`element-card ${groupClass} ${stateClass} view-${difficulty.toLowerCase()} ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`.trim()}
      style={{ gridColumn: col, gridRow: row }}
      onClick={onClick}
      data-testid={"element-" + element.atomicNumber}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHoverGroup && onHoverGroup(groupClass)}
      onMouseLeave={() => onHoverGroup && onHoverGroup(null)}
      onFocus={() => onHoverGroup && onHoverGroup(groupClass)}
      onBlur={() => onHoverGroup && onHoverGroup(null)}
    >
      {element.stateAtRoomTemp && <div className="state-badge"></div>}
      <div className="atomic-number">{element.atomicNumber}</div>
      <div className="symbol">{element.symbol}</div>
      <div className="name">{element.name}</div>
      {difficulty !== 'Beginner' && <div className="atomic-mass">{element.atomicMass}</div>}
      
      {(difficulty === 'Intermediate' || difficulty === 'Advanced') && (
        <div className="group-block">{element.groupBlock}</div>
      )}
      
      {difficulty === 'Advanced' && (
        <div className="electron-configuration" dangerouslySetInnerHTML={{ __html: typeof element.electronConfiguration === 'string' ? element.electronConfiguration.replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>') : "" }}></div>
      )}
    </div>
  );
});
