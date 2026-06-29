import React, { useState, useEffect, useRef } from 'react';

// Common isotope decay parameters
const DECAY_MODES = {
  'Alpha': { particles: 'α (⁴He nucleus)', type: 'alpha' },
  'Beta': { particles: 'β⁻ (electron)', type: 'beta' },
  'Beta+': { particles: 'β⁺ (positron)', type: 'beta-plus' },
  'Gamma': { particles: 'γ (high-energy photon)', type: 'gamma' },
  'SF': { particles: 'Spontaneous Fission', type: 'fission' },
  'EC': { particles: 'Electron Capture', type: 'ec' }
};

// Simple helper to parse half-life into relative seconds for the simulation
const parseHalfLifeToSeconds = (halfLifeStr) => {
  if (!halfLifeStr) return 10;
  const lower = halfLifeStr.toLowerCase();
  if (lower.includes('stable')) return Infinity;
  
  const val = parseFloat(lower);
  if (isNaN(val)) return 10;
  
  if (lower.includes('ms') || lower.includes('millisecond')) return val / 1000;
  if (lower.includes('μs') || lower.includes('microsecond')) return val / 1000000;
  if (lower.includes('s') && !lower.includes('m') && !lower.includes('y')) return val;
  if (lower.includes('m') && !lower.includes('s')) return val * 60; // minutes
  if (lower.includes('h')) return val * 3600; // hours
  if (lower.includes('d')) return val * 86400; // days
  if (lower.includes('y')) return val * 31536000; // years
  
  return val;
};

export function IsotopeDecay({ element }) {
  const [selectedIsotope, setSelectedIsotope] = useState(null);
  const [atoms, setAtoms] = useState([]);
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const timerRef = useRef(null);

  const isotopes = element.isotopes || [];

  useEffect(() => {
    if (isotopes.length > 0) {
      setSelectedIsotope(isotopes[0]);
    } else {
      setSelectedIsotope(null);
    }
    resetSimulation();
  }, [element]);

  useEffect(() => {
    resetSimulation();
  }, [selectedIsotope]);

  const resetSimulation = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSimTime(0);
    setHistory([{ time: 0, count: 100 }]);
    
    // Initialize 100 atoms grid (x, y coordinates, status: true = active, false = decayed)
    const initialAtoms = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (i % 10) * 10 + 5,
      y: Math.floor(i / 10) * 10 + 5,
      active: true
    }));
    setAtoms(initialAtoms);
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (!selectedIsotope) return;
      const halfLifeSecs = parseHalfLifeToSeconds(selectedIsotope.halfLife);
      if (halfLifeSecs === Infinity) return;

      setIsRunning(true);
      // Determine simulation decay constant lambda
      // Scale half life to fit within a 15-second visual loop
      const simHalfLifeSteps = 50; // half life is 5 seconds of sim time (50 * 100ms)
      const decayProbPerStep = 1 - Math.exp(-Math.LN2 / simHalfLifeSteps);

      timerRef.current = setInterval(() => {
        setAtoms(prevAtoms => {
          let activeCount = 0;
          const nextAtoms = prevAtoms.map(atom => {
            if (atom.active) {
              const decays = Math.random() < decayProbPerStep;
              if (decays) {
                return { ...atom, active: false };
              }
              activeCount++;
            }
            return atom;
          });

          setSimTime(prevTime => {
            const nextTime = prevTime + 0.1;
            setHistory(prevHist => [...prevHist, { time: nextTime, count: activeCount }]);
            return nextTime;
          });

          if (activeCount === 0) {
            setIsRunning(false);
            clearInterval(timerRef.current);
          }

          return nextAtoms;
        });
      }, 100);
    }
  };

  // Determine equation parameters
  const getDecayEquation = () => {
    if (!selectedIsotope) return '';
    const name = selectedIsotope.isotopeName || element.symbol;
    const match = name.match(/(\d+)$/);
    const mass = match ? parseInt(match[1], 10) : Math.round(element.atomicMass);
    const z = element.atomicNumber;

    const mode = selectedIsotope.decayMode || 'Alpha';
    const isStable = selectedIsotope.halfLife && selectedIsotope.halfLife.toLowerCase().includes('stable');

    if (isStable) return `${mass}Z ${element.symbol} (Stable)`;

    let daughterZ = z;
    let daughterMass = mass;
    let particleSymbol = '';

    if (mode.includes('Alpha')) {
      daughterZ = z - 2;
      daughterMass = mass - 4;
      particleSymbol = '⁴₂He (α)';
    } else if (mode.includes('Beta-') || mode.includes('Beta')) {
      daughterZ = z + 1;
      daughterMass = mass;
      particleSymbol = '⁰₋₁e (β⁻)';
    } else if (mode.includes('Beta+') || mode.includes('EC')) {
      daughterZ = z - 1;
      daughterMass = mass;
      particleSymbol = '⁰₁e (β⁺)';
    } else {
      particleSymbol = 'γ (photon)';
    }

    return (
      <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#4facfe', marginTop: '8px' }}>
        {`²${mass} ${element.symbol} → ²${daughterMass} [Z=${daughterZ}] + ${particleSymbol}`}
      </div>
    );
  };

  return (
    <div className="decay-sandbox-container" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem' }}>Isotope Sandbox</span>
        {isotopes.length > 0 && (
          <select
            value={isotopes.indexOf(selectedIsotope)}
            onChange={(e) => setSelectedIsotope(isotopes[e.target.value])}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.8rem'
            }}
          >
            {isotopes.map((iso, idx) => (
              <option key={idx} value={idx}>{iso.isotopeName} ({iso.halfLife})</option>
            ))}
          </select>
        )}
      </div>

      {selectedIsotope ? (
        <>
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
            {/* 10x10 Particle Grid */}
            <svg viewBox="0 0 100 100" style={{ width: '120px', height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              {atoms.map(atom => (
                <circle
                  key={atom.id}
                  cx={atom.x}
                  cy={atom.y}
                  r="3.5"
                  fill={atom.active ? '#00f2fe' : 'rgba(255,255,255,0.15)'}
                  style={{
                    transition: 'fill 0.2s ease',
                    filter: atom.active ? 'drop-shadow(0 0 2px #00f2fe)' : 'none'
                  }}
                />
              ))}
            </svg>

            {/* Decay Curve SVG graph */}
            <svg viewBox="0 0 100 100" style={{ flex: 1, height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              {/* Gridlines */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.05)" />
              
              {/* Curve path */}
              <polyline
                fill="none"
                stroke="#ff4757"
                strokeWidth="2"
                points={history.map((pt, i) => {
                  const x = Math.min(100, i * 0.8);
                  const y = 100 - pt.count;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              <text x="5" y="15" fill="rgba(255,255,255,0.5)" style={{ fontSize: '7px' }}>Parent Atoms %</text>
            </svg>
          </div>

          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem' }}>Half-life: <strong>{selectedIsotope.halfLife}</strong></div>
              {getDecayEquation()}
            </div>
            <button
              onClick={handleStartStop}
              style={{
                background: isRunning ? '#ff4757' : '#00f2fe',
                border: 'none',
                color: '#12131c',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isRunning ? '⏹ Stop' : '▶ Decay'}
            </button>
          </div>
        </>
      ) : (
        <div style={{ opacity: 0.6, fontSize: '0.8rem', textAlign: 'center', padding: '20px' }}>No isotope data available.</div>
      )}
    </div>
  );
}
