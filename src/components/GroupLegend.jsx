import React from 'react';

const GROUPS = [
  { name: 'Nonmetal', id: 'nonmetal' },
  { name: 'Noble gas', id: 'noble-gas' },
  { name: 'Alkali metal', id: 'alkali-metal' },
  { name: 'Alkaline earth metal', id: 'alkaline-earth-metal' },
  { name: 'Metalloid', id: 'metalloid' },
  { name: 'Halogen', id: 'halogen' },
  { name: 'Post-transition metal', id: 'post-transition-metal' },
  { name: 'Transition metal', id: 'transition-metal' },
  { name: 'Lanthanide', id: 'lanthanide' },
  { name: 'Actinide', id: 'actinide' }
];

export function GroupLegend({ onHoverGroup }) {
  return (
    <div className="group-legend" data-testid="group-legend">
      {GROUPS.map((group) => (
        <button
          key={group.id}
          className={`legend-btn ${group.id}`}
          data-testid={`legend-${group.id}`}
          onMouseEnter={() => onHoverGroup(group.id)}
          onMouseLeave={() => onHoverGroup(null)}
          onFocus={() => onHoverGroup(group.id)}
          onBlur={() => onHoverGroup(null)}
        >
          {group.name}
        </button>
      ))}
    </div>
  );
}
