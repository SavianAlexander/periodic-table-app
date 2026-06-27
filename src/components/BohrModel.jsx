import React, { useState } from 'react';

// Parser function to extract shell distributions from the electronConfiguration
export function parseElectronConfiguration(config) {
  if (!config || typeof config !== 'string') return [];
  
  // Clean up HTML tags (e.g. <sup>)
  const cleanConfig = config.replace(/<[^>]+>/g, '').trim();

  // Map noble gas cores to their corresponding shell arrays
  const nobleGasCores = {
    '[He]': [2],
    '[Ne]': [2, 8],
    '[Ar]': [2, 8, 8],
    '[Kr]': [2, 8, 18, 8],
    '[Xe]': [2, 8, 18, 18, 8],
    '[Rn]': [2, 8, 18, 32, 18, 8]
  };

  let shells = [];

  // Check if it starts with a noble gas core
  const coreMatch = cleanConfig.match(/^(\[[A-Za-z]+\])/);
  let remaining = cleanConfig;
  if (coreMatch) {
    const core = coreMatch[1];
    if (nobleGasCores[core]) {
      shells = [...nobleGasCores[core]];
    }
    remaining = cleanConfig.slice(core.length).trim();
  }

  // Parse remaining subshells (e.g., "4f14 5d10 6s2 6p2")
  const subshellRegex = /(\d+)[a-z](\d+)/gi;
  let match;
  while ((match = subshellRegex.exec(remaining)) !== null) {
    const n = parseInt(match[1], 10);
    const electrons = parseInt(match[2], 10);
    const shellIndex = n - 1;
    
    while (shells.length <= shellIndex) {
      shells.push(0);
    }
    shells[shellIndex] += electrons;
  }

  return shells;
}

const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export function BohrModel({ element }) {
  if (!element) return null;

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredShell, setHoveredShell] = useState(null);

  const shells = parseElectronConfiguration(element.electronConfiguration);
  const totalElectrons = shells.reduce((acc, curr) => acc + curr, 0);

  if (shells.length === 0 || totalElectrons === 0) {
    return (
      <div className="bohr-model-fallback" style={{
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.95rem'
      }}>
        Bohr model data not available
      </div>
    );
  }

  // Orbit radius calculations.
  const maxRadius = 135;
  const minRadius = 38;
  const numShells = shells.length;
  
  const getRadius = (index) => {
    if (numShells <= 1) return minRadius;
    return minRadius + (index * (maxRadius - minRadius)) / (numShells - 1);
  };

  return (
    <div className="bohr-model-container" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes bohr-rotate-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bohr-rotate-counter-clockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .bohr-orbit-group {
          transform-origin: 150px 150px;
        }
        .bohr-orbit-0 { animation: bohr-rotate-clockwise 8s linear infinite; }
        .bohr-orbit-1 { animation: bohr-rotate-counter-clockwise 12s linear infinite; }
        .bohr-orbit-2 { animation: bohr-rotate-clockwise 16s linear infinite; }
        .bohr-orbit-3 { animation: bohr-rotate-counter-clockwise 20s linear infinite; }
        .bohr-orbit-4 { animation: bohr-rotate-clockwise 24s linear infinite; }
        .bohr-orbit-5 { animation: bohr-rotate-counter-clockwise 28s linear infinite; }
        .bohr-orbit-6 { animation: bohr-rotate-clockwise 32s linear infinite; }
        
        .bohr-paused {
          animation-play-state: paused !important;
        }

        .bohr-nucleus-glow {
          filter: drop-shadow(0px 0px 8px rgba(79, 172, 254, 0.6));
        }
        .bohr-electron-glow {
          filter: drop-shadow(0px 0px 5px #00f2fe);
          transition: r 0.2s ease, fill 0.2s ease;
        }
        .bohr-electron-highlighted {
          fill: #ff4757 !important;
          r: 7px !important;
          filter: drop-shadow(0px 0px 8px #ff4757) !important;
        }
        .bohr-shell-text {
          fill: rgba(255, 255, 255, 0.4);
          font-size: 8px;
          font-family: system-ui, sans-serif;
          pointer-events: none;
        }
        .bohr-shell-text-highlighted {
          fill: #00f2fe;
          font-weight: bold;
        }
        .bohr-orbit-path-highlighted {
          stroke: rgba(0, 242, 254, 0.6) !important;
          stroke-width: 1.5px !important;
        }
      `}</style>

      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Bohr Orbit Simulation</span>
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '12px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>

      <svg 
        viewBox="0 0 300 300" 
        width="100%" 
        height="100%" 
        style={{ 
          maxWidth: '280px', 
          maxHeight: '280px',
          overflow: 'visible' 
        }}
      >
        <defs>
          <radialGradient id="nucleus-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="70%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#00b4d8" />
          </radialGradient>
        </defs>

        {/* Draw orbits and electrons */}
        {shells.map((numElectrons, i) => {
          const R = getRadius(i);
          const isShellHighlighted = hoveredShell === i;
          
          // Position electrons evenly
          const electronElements = [];
          for (let j = 0; j < numElectrons; j++) {
            const angle = (j * 2 * Math.PI) / numElectrons;
            const cx = 150 + R * Math.cos(angle);
            const cy = 150 + R * Math.sin(angle);
            electronElements.push(
              <circle
                key={j}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#ffffff"
                className={`bohr-electron-glow ${isShellHighlighted ? 'bohr-electron-highlighted' : ''}`}
                style={{
                  stroke: isShellHighlighted ? '#ff4757' : '#00f2fe',
                  strokeWidth: 1
                }}
              />
            );
          }

          const shellLetter = SHELL_LETTERS[i] || `n=${i+1}`;

          return (
            <g key={i}>
              {/* Orbit path */}
              <circle
                cx="150"
                cy="150"
                r={R}
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeDasharray="4 4"
                className={isShellHighlighted ? 'bohr-orbit-path-highlighted' : ''}
              />
              
              {/* Shell name label */}
              <text
                x="150"
                y={150 - R - 3}
                textAnchor="middle"
                className={`bohr-shell-text ${isShellHighlighted ? 'bohr-shell-text-highlighted' : ''}`}
              >
                {shellLetter}
              </text>

              {/* Rotating electron group */}
              <g className={`bohr-orbit-group bohr-orbit-${i} ${isPaused ? 'bohr-paused' : ''}`}>
                {electronElements}
              </g>
            </g>
          );
        })}

        {/* Central Nucleus */}
        <g className="bohr-nucleus-glow">
          <circle
            cx="150"
            cy="150"
            r="18"
            fill="url(#nucleus-gradient)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
          />
          <text
            x="150"
            y="154"
            textAnchor="middle"
            fill="#ffffff"
            style={{
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.2px'
            }}
          >
            {element.symbol}
          </text>
        </g>
      </svg>
      
      {/* Legend showing shell distribution detail with interactive highlights */}
      <div className="bohr-model-legend-pills" style={{
        fontSize: '0.82rem',
        letterSpacing: '0.3px',
        textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '4px'
      }}>
        {shells.map((num, idx) => (
          <span 
            key={idx}
            onMouseEnter={() => setHoveredShell(idx)}
            onMouseLeave={() => setHoveredShell(null)}
            style={{
              background: hoveredShell === idx ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: hoveredShell === idx ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '2px 6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: hoveredShell === idx ? '#00f2fe' : '#fff'
            }}
          >
            {SHELL_LETTERS[idx] || `n=${idx+1}`}: {num}e⁻
          </span>
        ))}
      </div>
      
      <div className="bohr-model-legend" style={{
        fontSize: '0.82rem',
        opacity: 0.8,
        letterSpacing: '0.3px',
        textAlign: 'center'
      }}>
        Shells: {shells.join(' • ')} ({totalElectrons} e⁻)
      </div>
      
      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '-4px' }}>
        Hover shell pills to highlight corresponding electrons
      </div>
    </div>
  );
}
