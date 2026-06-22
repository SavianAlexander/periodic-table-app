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
  setActiveGroup
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
