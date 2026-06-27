import React, { useState } from 'react';
import elements from '../data/elements.json';
import { ElementCard } from './ElementCard';
import { getGridPosition } from '../utils/grid';
import '../styles/grid.css';
import '../styles/main.css';

function matchesGroup(elementGroupBlock, activeGroup) {
  if (!activeGroup) return true;
  const elementGroup = (elementGroupBlock || '').toLowerCase();
  const filterGroup = activeGroup.toLowerCase();
  if (filterGroup === 'reactive-nonmetal' || filterGroup === 'reactive nonmetal') {
    return elementGroup === 'nonmetal' || elementGroup === 'halogen' || elementGroup === 'reactive nonmetal' || elementGroup === 'reactive-nonmetal';
  }
  return elementGroup === filterGroup || elementGroup.replace(/\s+/g, '-') === filterGroup.replace(/\s+/g, '-');
}

function matchesState(elementState, activeState) {
  if (!activeState) return true;
  return (elementState || '').toLowerCase() === activeState.toLowerCase();
}

function matchesElectronegativity(elementEN, maxEN) {
  if (maxEN === undefined || maxEN === null || maxEN >= 4.0) return true;
  if (elementEN === undefined || elementEN === null) return false;
  return elementEN <= maxEN;
}

function matchesSearch(element, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return true;
  const q = searchQuery.trim();
  
  // Regex to detect property range queries, e.g. mass > 50
  const rangeRegex = /^\s*([a-zA-Z_]+)\s*(<=|>=|<|>|==|=)\s*(-?\d+(?:\.\d+)?)\s*$/;
  const match = q.match(rangeRegex);
  
  if (match) {
    const [_, rawProp, operator, rawValue] = match;
    const prop = rawProp.toLowerCase();
    const value = parseFloat(rawValue);
    
    // Map standard property names to keys in element object
    let key = null;
    if (prop === 'mass' || prop === 'weight' || prop === 'atomicmass') {
      key = 'atomicMass';
    } else if (prop === 'number' || prop === 'atomic' || prop === 'z' || prop === 'atomicnumber') {
      key = 'atomicNumber';
    } else if (prop === 'electronegativity' || prop === 'en') {
      key = 'electronegativity';
    } else if (prop === 'density') {
      key = 'density';
    } else if (prop === 'ionization' || prop === 'ionizationenergy') {
      key = 'ionizationEnergy';
    } else if (prop === 'melting' || prop === 'mp' || prop === 'meltingpoint') {
      key = 'meltingPoint';
    } else if (prop === 'boiling' || prop === 'bp' || prop === 'boilingpoint') {
      key = 'boilingPoint';
    }
    
    if (key) {
      const val = element[key];
      if (val === undefined || val === null || typeof val !== 'number') {
        return false;
      }
      switch (operator) {
        case '>': return val > value;
        case '<': return val < value;
        case '>=': return val >= value;
        case '<=': return val <= value;
        case '=':
        case '==': return val === value;
        default: return false;
      }
    }
  }
  
  // Substring match for symbol, name, or atomic number
  const searchLower = q.toLowerCase();
  const symbolMatch = element.symbol && element.symbol.toLowerCase().includes(searchLower);
  const nameMatch = element.name && element.name.toLowerCase().includes(searchLower);
  const numberMatch = element.atomicNumber !== undefined && String(element.atomicNumber).includes(searchLower);
  
  return !!(symbolMatch || nameMatch || numberMatch);
}

export function PeriodicTable({ difficulty, searchQuery, activeGroup, stateFilter, maxElectronegativity, onElementClick }) {
  const [hoveredGroup, setHoveredGroup] = useState(null);

  const hasActiveFilters = !!((searchQuery && searchQuery.trim()) || activeGroup || stateFilter || maxElectronegativity < 4.0);

  return (
    <div className="table-container">
      <div 
        className="periodic-table" 
        data-testid="periodic-table-grid"
        data-active-group={hoveredGroup}
      >
        <div data-testid="lanthanide-series" style={{ gridRow: 9, gridColumn: '1 / 4', alignSelf: 'center', textAlign: 'right', paddingRight: '10px', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>Lanthanides</div>
        <div data-testid="actinide-series" style={{ gridRow: 10, gridColumn: '1 / 4', alignSelf: 'center', textAlign: 'right', paddingRight: '10px', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>Actinides</div>
        {elements.map((element) => {
          const { row, col } = getGridPosition(element.atomicNumber);
          const isMatch = matchesGroup(element.groupBlock, activeGroup) && 
                          matchesSearch(element, searchQuery) &&
                          matchesState(element.stateAtRoomTemp, stateFilter) &&
                          matchesElectronegativity(element.electronegativity, maxElectronegativity);
          return (
            <ElementCard 
              key={element.atomicNumber} 
              element={element} 
              row={row} 
              col={col} 
              difficulty={difficulty}
              onClick={() => onElementClick(element)}
              onHoverGroup={setHoveredGroup}
              isHighlighted={hasActiveFilters && isMatch}
              isDimmed={hasActiveFilters && !isMatch}
            />
          );
        })}
      </div>
    </div>
  );
}
