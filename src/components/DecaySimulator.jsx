import React, { useState, useEffect, useRef } from 'react';

const ISOTOPES = [
  {
    id: 'C14',
    name: 'Carbon-14',
    halfLife: '5,730 Years',
    type: 'Beta (β⁻)',
    equation: '¹⁴C ➔ ¹⁴N + e⁻ + ν̅',
    parent: 'Carbon-14 (⁶p, ⁸n)',
    daughter: 'Nitrogen-14 (⁷p, ⁷n)',
    particleName: 'Beta electron (e⁻)',
    particleColor: '#00f2fe',
    description: 'Used in radiocarbon dating to determine the age of organic materials up to 50,000 years old.'
  },
  {
    id: 'U238',
    name: 'Uranium-238',
    halfLife: '4.47 Billion Years',
    type: 'Alpha (α)',
    equation: '²³⁸U ➔ ²³⁴Th + ⁴He',
    parent: 'Uranium-238 (⁹²p, ¹⁴⁶n)',
    daughter: 'Thorium-234 (⁹⁰p, ¹⁴⁴n)',
    particleName: 'Alpha Helium nucleus (⁴He)',
    particleColor: '#ff4757',
    description: 'The most common natural isotope of uranium. Its decay helps determine the age of the Earth\'s oldest rocks.'
  },
  {
    id: 'Ra226',
    name: 'Radium-226',
    halfLife: '1,600 Years',
    type: 'Alpha (α)',
    equation: '²²⁶Ra ➔ ²²²Rn + ⁴He',
    parent: 'Radium-226 (⁸⁸p, ¹³⁸n)',
    daughter: 'Radon-222 (⁸⁶p, ¹³⁶n)',
    particleName: 'Alpha Helium nucleus (⁴He)',
    particleColor: '#ffa502',
    description: 'Discovered by Marie and Pierre Curie. Highly radioactive and decays into gaseous Radon-222.'
  },
  {
    id: 'Co60',
    name: 'Cobalt-60',
    halfLife: '5.27 Years',
    type: 'Beta / Gamma (β/γ)',
    equation: '⁶⁰Co ➔ ⁶⁰Ni + e⁻ + γ',
    parent: 'Cobalt-60 (²⁷p, ³³n)',
    daughter: 'Nickel-60 (²⁸p, ³²n)',
    particleName: 'Beta / Gamma Photon (γ)',
    particleColor: '#2ed573',
    description: 'A synthetic radioactive isotope used in cancer radiotherapy and industrial radiography.'
  },
  {
    id: 'Po210',
    name: 'Polonium-210',
    halfLife: '138 Days',
    type: 'Alpha (α)',
    equation: '²¹⁰Po ➔ ²⁰⁶Pb + ⁴He',
    parent: 'Polonium-210 (⁸⁴p, ¹²⁶n)',
    daughter: 'Lead-206 (⁸²p, ¹²⁴n)',
    particleName: 'Alpha Helium nucleus (⁴He)',
    particleColor: '#1e90ff',
    description: 'Extremely toxic and volatile alpha emitter. Decays directly to stable Lead-206.'
  }
];

export function DecaySimulator() {
  const [activeIsotope, setActiveIsotope] = useState(ISOTOPES[0]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [atoms, setAtoms] = useState([]);
  const [history, setHistory] = useState([{ time: 0, parentPct: 100 }]);
  const [particles, setParticles] = useState([]); // Array of emitting particles
  
  const timerRef = useRef(null);
  const simStepRef = useRef(0);

  // Initialize 100 parent atoms arranged in a stable grid
  const resetSimulation = () => {
    setSimulationRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    simStepRef.current = 0;
    
    const initialAtoms = Array.from({ length: 100 }).map((_, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      return {
        id: i,
        x: 20 + col * 26 + (row % 2 ? 6 : 0), // offset hexagonal look
        y: 20 + row * 23,
        state: 'parent' // 'parent' or 'daughter'
      };
    });
    
    setAtoms(initialAtoms);
    setHistory([{ time: 0, parentPct: 100 }]);
    setParticles([]);
  };

  useEffect(() => {
    resetSimulation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIsotope]);

  const startSimulation = () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    
    const maxSteps = 40; // 4 half-lives
    
    timerRef.current = setInterval(() => {
      simStepRef.current += 1;
      const currentStep = simStepRef.current;
      
      // Calculate decay percentage using standard exponential formula
      // N(t) = N0 * (0.5)^(t / t_halflife)
      // We map 40 steps to 4 half-lives (10 steps per half-life)
      const halfLivesElapsed = currentStep / 10;
      const targetParentPct = Math.round(100 * Math.pow(0.5, halfLivesElapsed));
      
      setAtoms(prevAtoms => {
        const parents = prevAtoms.filter(a => a.state === 'parent');
        const numToDecay = Math.max(0, parents.length - targetParentPct);
        
        if (numToDecay <= 0) return prevAtoms;
        
        // Randomly choose which parent atoms to decay
        const shuffledParents = [...parents].sort(() => 0.5 - Math.random());
        const toDecayIds = new Set(shuffledParents.slice(0, numToDecay).map(a => a.id));
        
        // Trigger particle animations for decaying atoms
        const newParticles = [];
        const updated = prevAtoms.map(a => {
          if (toDecayIds.has(a.id)) {
            newParticles.push({
              id: Date.now() + Math.random(),
              startX: a.x,
              startY: a.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              color: activeIsotope.particleColor,
              name: activeIsotope.type.includes('Beta') ? 'β' : activeIsotope.type.includes('Gamma') ? 'γ' : 'α'
            });
            return { ...a, state: 'daughter' };
          }
          return a;
        });

        // Add to particles log (keep them animated briefly)
        setParticles(prev => [...prev, ...newParticles].slice(-40));
        return updated;
      });

      setHistory(prev => [
        ...prev,
        { time: halfLivesElapsed, parentPct: targetParentPct }
      ]);

      if (currentStep >= maxSteps) {
        setSimulationRunning(false);
        clearInterval(timerRef.current);
      }
    }, 200); // 200ms per step
  };

  // Particle emission animation loop (ticks independently if simulation is active)
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animationTimer = setTimeout(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          startX: p.startX + p.vx,
          startY: p.startY + p.vy
        })).filter(p => p.startX > 0 && p.startX < 300 && p.startY > 0 && p.startY < 260)
      );
    }, 30);

    return () => clearTimeout(animationTimer);
  }, [particles]);

  // Width/Height dimensions of graph
  const width = 300;
  const height = 180;
  const padLeft = 30;
  const padBottom = 25;
  const chartW = width - padLeft - 10;
  const chartH = height - padBottom - 10;

  return (
    <div className="decay-simulator-container" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      maxWidth: '1000px',
      margin: '20px auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>Nuclear Decay & Half-Life Simulator</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Observe exponential radioactive decay rates and emitted nuclear particles in real-time.
          </p>
        </div>

        {/* Isotope selector dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', opacity: 0.8 }}>Active Isotope:</label>
          <select
            value={ISOTOPES.findIndex(i => i.id === activeIsotope.id)}
            onChange={(e) => setActiveIsotope(ISOTOPES[parseInt(e.target.value)])}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
            className="isotope-select-dropdown"
          >
            {ISOTOPES.map((iso, i) => (
              <option key={iso.id} value={i}>{iso.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'start'
      }} className="decay-dashboard-layout">
        
        {/* Left Hand: Visual Nuclei Grid and controls */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* SVG atoms grid */}
          <svg
            viewBox="0 0 280 250"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '16px'
            }}
          >
            {/* Draw active atoms */}
            {atoms.map((a) => (
              <circle
                key={a.id}
                cx={a.x}
                cy={a.y}
                r="7"
                fill={a.state === 'parent' ? '#eccc68' : '#747d8c'}
                stroke={a.state === 'parent' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}
                strokeWidth="1"
                style={{ transition: 'fill 0.15s ease' }}
              />
            ))}

            {/* Emitted flying particles */}
            {particles.map((p) => (
              <g key={p.id}>
                <circle cx={p.startX} cy={p.startY} r="4" fill={p.color} style={{ filter: `drop-shadow(0 0 2px ${p.color})` }} />
                <text x={p.startX} y={p.startY - 5} fill={p.color} style={{ fontSize: '8px', fontWeight: 'bold' }} textAnchor="middle">{p.name}</text>
              </g>
            ))}
          </svg>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={startSimulation}
              disabled={simulationRunning || history.length > 1}
              style={{
                background: simulationRunning || history.length > 1 ? 'rgba(255,255,255,0.05)' : '#00f2fe',
                border: 'none',
                color: simulationRunning || history.length > 1 ? 'rgba(255,255,255,0.3)' : '#000',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
              className="start-decay-btn"
            >
              Start Decay
            </button>
            <button
              onClick={resetSimulation}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
              className="reset-decay-btn"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Hand: Statistics, decay equation, and line chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Decay Equation Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '14px',
            color: '#fff'
          }} className="decay-equation-card">
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#00f2fe' }}>Decay Equation</h3>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px', margin: '8px 0', fontFamily: 'monospace' }}>
              {activeIsotope.equation}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              <div>Parent: <strong>{activeIsotope.parent}</strong></div>
              <div>Daughter: <strong>{activeIsotope.daughter}</strong></div>
              <div>Half-Life: <strong>{activeIsotope.halfLife}</strong></div>
              <div>Emitted: <span style={{ color: activeIsotope.particleColor, fontWeight: 'bold' }}>{activeIsotope.particleName}</span></div>
            </div>
          </div>

          {/* Exponential Decay Graph */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#fff' }}>Decay Rate Curve</h3>
            
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.1)', overflow: 'visible' }}>
              {/* Axes */}
              <line x1={padLeft} y1={5} x2={padLeft} y2={height - padBottom} stroke="rgba(255,255,255,0.2)" />
              <line x1={padLeft} y1={height - padBottom} x2={width - 5} y2={height - padBottom} stroke="rgba(255,255,255,0.2)" />

              {/* Grid Y labels */}
              {[0, 25, 50, 75, 100].map(yVal => {
                const y = height - padBottom - (yVal / 100) * chartH;
                return (
                  <g key={yVal}>
                    <line x1={padLeft} y1={y} x2={width - 5} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                    <text x={padLeft - 5} y={y + 3} fill="rgba(255,255,255,0.5)" textAnchor="end" style={{ fontSize: '8px' }}>{yVal}%</text>
                  </g>
                );
              })}

              {/* Grid X labels */}
              {[0, 1, 2, 3, 4].map(xVal => {
                const x = padLeft + (xVal / 4) * chartW;
                return (
                  <g key={xVal}>
                    <line x1={x} y1={5} x2={x} y2={height - padBottom} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                    <text x={x} y={height - padBottom + 12} fill="rgba(255,255,255,0.5)" textAnchor="middle" style={{ fontSize: '8px' }}>{xVal} t½</text>
                  </g>
                );
              })}

              {/* Plot history points */}
              {(() => {
                if (history.length < 2) return null;
                const points = history.map(pt => {
                  const x = padLeft + (pt.time / 4) * chartW;
                  const y = height - padBottom - (pt.parentPct / 100) * chartH;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <>
                    <polyline points={points} fill="none" stroke="#00f2fe" strokeWidth="2" />
                    {history.map((pt, idx) => {
                      const x = padLeft + (pt.time / 4) * chartW;
                      const y = height - padBottom - (pt.parentPct / 100) * chartH;
                      return (
                        <circle key={idx} cx={x} cy={y} r="3" fill="#ff4757" />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          
          {/* Trivia / Context */}
          <div style={{ fontSize: '0.8rem', opacity: 0.7, fontStyle: 'italic', lineHeight: '1.4' }}>
            {activeIsotope.description}
          </div>

        </div>

      </div>
    </div>
  );
}
