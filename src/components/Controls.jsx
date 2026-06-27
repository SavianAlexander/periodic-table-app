import React from 'react';

const CHEMICAL_GROUPS = [
  { name: 'Alkali metal', id: 'alkali-metal' },
  { name: 'Alkaline earth metal', id: 'alkaline-earth-metal' },
  { name: 'Transition metal', id: 'transition-metal' },
  { name: 'Lanthanide', id: 'lanthanide' },
  { name: 'Actinide', id: 'actinide' },
  { name: 'Post-transition metal', id: 'post-transition-metal' },
  { name: 'Metalloid', id: 'metalloid' },
  { name: 'Reactive nonmetal', id: 'reactive-nonmetal' },
  { name: 'Noble gas', id: 'noble-gas' }
];

export function Controls({ 
  difficulty, 
  setDifficulty,
  searchQuery,
  setSearchQuery,
  activeGroup,
  setActiveGroup,
  stateFilter,
  setStateFilter,
  maxElectronegativity,
  setMaxElectronegativity
}) {
  const handleGroupClick = (groupId) => {
    if (activeGroup === groupId) {
      setActiveGroup(null);
    } else {
      setActiveGroup(groupId);
    }
  };

  return (
    <div className="controls-container">
      <div className="controls" data-testid="difficulty-toggle">
        <span id="difficulty-label">
          Difficulty: <strong data-testid="current-mode">{difficulty}</strong>
        </span>
        <div 
          role="group" 
          aria-labelledby="difficulty-label"
          className="difficulty-buttons"
        >
          <button 
            data-testid="difficulty-beginner" 
            onClick={() => setDifficulty('Beginner')}
            aria-pressed={difficulty === 'Beginner'}
          >
            Beginner
          </button>
          <button 
            data-testid="difficulty-intermediate" 
            onClick={() => setDifficulty('Intermediate')}
            aria-pressed={difficulty === 'Intermediate'}
          >
            Intermediate
          </button>
          <button 
            data-testid="difficulty-advanced" 
            onClick={() => setDifficulty('Advanced')}
            aria-pressed={difficulty === 'Advanced'}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          data-testid="search-input"
          placeholder="Search by name, symbol, number (e.g. C, 6, Carbon) or range (e.g. mass > 50, electronegativity < 2.0)..."
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Polish Filter Row */}
      <div className="advanced-filters-row" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', margin: '12px 0', padding: '8px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="state-filter-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.8, color: '#fff' }}>State:</span>
          {['Gas', 'Liquid', 'Solid', 'Synthetic'].map(state => {
            const isActive = stateFilter === state;
            return (
              <button
                key={state}
                onClick={() => setStateFilter(stateFilter === state ? null : state)}
                style={{
                  background: isActive ? '#4facfe' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 10px rgba(79, 172, 254, 0.5)' : 'none'
                }}
              >
                {state}
              </button>
            )
          })}
        </div>

        <div className="electronegativity-filter" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.8, color: '#fff' }}>Max Electronegativity:</span>
          <input
            type="range"
            min="0.7"
            max="4.0"
            step="0.1"
            value={maxElectronegativity}
            onChange={(e) => setMaxElectronegativity(parseFloat(e.target.value))}
            style={{ width: '120px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#4facfe', fontWeight: 'bold' }}>{maxElectronegativity.toFixed(1)}</span>
          {maxElectronegativity < 4.0 && (
            <button
              onClick={() => setMaxElectronegativity(4.0)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="interactive-legend" data-testid="group-legend">
        {CHEMICAL_GROUPS.map((group) => {
          const isActive = activeGroup === group.id;
          return (
            <button
              key={group.id}
              className={`legend-btn ${group.id} ${isActive ? 'active' : ''}`}
              data-testid={`legend-${group.id}`}
              onClick={() => handleGroupClick(group.id)}
              aria-pressed={isActive}
            >
              <span className="legend-indicator"></span>
              {group.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
