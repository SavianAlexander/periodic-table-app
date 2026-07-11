import React, { useState, useEffect, useRef, useMemo } from 'react';

// Electrochemistry Electrode Reduction Potentials (E° in Volts)
const ELECTRODES = [
  { symbol: 'Zn', name: 'Zinc', E0: -0.76, color: '#a4b0be' },
  { symbol: 'Fe', name: 'Iron', E0: -0.44, color: '#747d8c' },
  { symbol: 'Pb', name: 'Lead', E0: -0.13, color: '#2f3542' },
  { symbol: 'Cu', name: 'Copper', E0: 0.34, color: '#ff7f50' },
  { symbol: 'Ag', name: 'Silver', E0: 0.80, color: '#f1f2f6' }
];

export function LabSimulator() {
  const [activeSubTab, setActiveSubTab] = useState('electro');

  // --- Electrochemistry State ---
  const [leftElectrode, setLeftElectrode] = useState(ELECTRODES[0]); // Zinc
  const [rightElectrode, setRightElectrode] = useState(ELECTRODES[3]); // Copper
  const [eTick, setETick] = useState(0);

  // Electron moving wire dots animation tick
  useEffect(() => {
    const timer = setInterval(() => {
      setETick(t => (t + 1) % 20);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const cellPotential = useMemo(() => {
    // Left is anode (oxidation), Right is cathode (reduction)
    // E°cell = E°cathode - E°anode
    return (rightElectrode.E0 - leftElectrode.E0).toFixed(2);
  }, [leftElectrode, rightElectrode]);

  const electronsFlowLeftToRight = rightElectrode.E0 > leftElectrode.E0;

  // --- Gas Laws State ---
  const [gasMode, setGasMode] = useState('boyle'); // 'boyle' or 'charles'
  const [temp, setTemp] = useState(300); // Kelvin
  const [vol, setVol] = useState(100); // Volume arbitrary units
  const [particles, setParticles] = useState([]);

  // Boyle's Law: P = k/V (constant T)
  // Charles's Law: V = k*T (constant P)
  const pressure = useMemo(() => {
    if (gasMode === 'boyle') {
      return ((300 * 100) / vol).toFixed(0);
    } else {
      // charles: constant P. Let P = 100.
      return 100;
    }
  }, [gasMode, vol, temp]);

  // Adjust Volume automatically in Charles mode when Temp changes
  useEffect(() => {
    if (gasMode === 'charles') {
      // V = k * T. At 300K, V = 100. So V = T / 3.
      setVol(Math.round(temp / 3));
    }
  }, [temp, gasMode]);

  // Initialize and animate gas particles inside the cylinder
  useEffect(() => {
    // Generate 15 particles
    const pts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 160,
      y: 80 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        // Piston top boundary limit. Cylinder height is 220.
        // Piston plate y position is based on volume: Y = 200 - Vol
        const pistonY = 220 - (vol * 0.9);
        // speed scaling with temperature
        const speedScale = temp / 300;

        return prev.map(p => {
          let nx = p.x + p.vx * speedScale;
          let ny = p.y + p.vy * speedScale;
          let nvx = p.vx;
          let nvy = p.vy;

          // bounce left/right walls
          if (nx < 15) { nx = 15; nvx = -nvx; }
          if (nx > 185) { nx = 185; nvx = -nvx; }

          // bounce bottom wall (210) and piston plate
          if (ny < pistonY + 10) { ny = pistonY + 10; nvy = -nvy; }
          if (ny > 210) { ny = 210; nvy = -nvy; }

          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        });
      });
    }, 40);

    return () => clearInterval(interval);
  }, [vol, temp]);

  // --- Titration State ---
  const [NaOHVolume, setNaOHVolume] = useState(0); // mL (0 to 50)
  const [titrationHistory, setTitrationHistory] = useState([{ vol: 0, pH: 1.0 }]);

  const currentPH = useMemo(() => {
    // Equivalence point is at 25 mL
    const V = NaOHVolume;
    if (V < 25) {
      // Acid excess
      const H_moles = (2.5 - 0.1 * V) * 0.001;
      const H_conc = H_moles / ((50 + V) * 0.001);
      return Math.max(1.0, -Math.log10(H_conc)).toFixed(2);
    } else if (V === 25) {
      return '7.00';
    } else {
      // Base excess
      const OH_moles = (0.1 * V - 2.5) * 0.001;
      const OH_conc = OH_moles / ((50 + V) * 0.001);
      const pOH = -Math.log10(OH_conc);
      return Math.min(13.0, 14 - pOH).toFixed(2);
    }
  }, [NaOHVolume]);

  const addDrop = (amount) => {
    setNaOHVolume(prev => {
      const next = Math.min(50, prev + amount);
      // Append to graph history
      setTitrationHistory(hist => {
        // calculate pH for next vol
        let nextPH = 7.0;
        if (next < 25) {
          const H_moles = (2.5 - 0.1 * next) * 0.001;
          const H_conc = H_moles / ((50 + next) * 0.001);
          nextPH = Math.max(1.0, -Math.log10(H_conc));
        } else if (next > 25) {
          const OH_moles = (0.1 * next - 2.5) * 0.001;
          const OH_conc = OH_moles / ((50 + next) * 0.001);
          const pOH = -Math.log10(OH_conc);
          nextPH = Math.min(13.0, 14 - pOH);
        }
        
        // check if already added
        if (hist.some(h => h.vol === next)) return hist;
        return [...hist, { vol: next, pH: nextPH }].sort((a,b) => a.vol - b.vol);
      });
      return next;
    });
  };

  const resetTitration = () => {
    setNaOHVolume(0);
    setTitrationHistory([{ vol: 0, pH: 1.0 }]);
  };

  // Beaker Indicator Color based on pH
  const indicatorColor = useMemo(() => {
    const pH = parseFloat(currentPH);
    if (pH < 4.0) {
      return 'rgba(255, 71, 87, 0.4)'; // Red/Pink acidic
    } else if (pH >= 4.0 && pH <= 8.0) {
      // blend to green neutral
      const pct = (pH - 4) / 4;
      const r = Math.round(255 - 200 * pct);
      const g = Math.round(71 + 140 * pct);
      const b = Math.round(87 + 20 * pct);
      return `rgba(${r}, ${g}, ${b}, 0.4)`;
    } else {
      return 'rgba(236, 204, 104, 0.4)'; // Yellow/blue/pink basic indicator (phenolphthalein turns hot magenta basic)
    }
  }, [currentPH]);

  return (
    <div className="lab-simulator-room" style={{
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
      
      {/* Visual lab selector sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>Lab Simulator Room</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Run interactive experiments for key core chemistry curriculum parameters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['electro', 'gas', 'titration'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                background: activeSubTab === tab ? '#00f2fe' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: activeSubTab === tab ? '#000' : '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
              className={`sub-tab-btn-${tab} ${activeSubTab === tab ? 'active' : ''}`}
            >
              {tab === 'electro' ? 'Electrochemistry Lab' : tab === 'gas' ? 'Gas Laws Lab' : 'Acid-Base Titration'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ELECTROCHEMISTRY LAB COMPONENT */}
      {activeSubTab === 'electro' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* SVG Galvanic Cell visual display */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'visible' }}>
              {/* Voltmeter / Wire bridge */}
              <rect x="175" y="15" width="50" height="30" rx="4" fill="#2f3542" stroke="rgba(255,255,255,0.2)" />
              <text x="200" y="34" fill="#00f2fe" textAnchor="middle" style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }} className="voltmeter-readout">
                {cellPotential} V
              </text>

              {/* Connecting wire lines */}
              <path d="M 80,80 L 80,30 L 175,30 M 225,30 L 320,30 L 320,80" fill="none" stroke="#fff" strokeWidth="2" />
              
              {/* Electron flow indicators */}
              {(() => {
                const step = eTick / 20; // 0 to 1
                const xPos = electronsFlowLeftToRight 
                  ? 80 + step * 240 // moving left to right
                  : 320 - step * 240;
                return (
                  <circle cx={xPos} cy={30} r="4" fill="#eccc68" />
                );
              })()}

              {/* Left Beaker (Anode side) */}
              <rect x="40" y="110" width="80" height="90" rx="5" fill="rgba(0, 242, 254, 0.1)" stroke="rgba(255,255,255,0.2)" />
              <rect x="70" y="80" width="20" height="80" fill={leftElectrode.color} stroke="rgba(255,255,255,0.3)" />
              <text x="80" y="190" fill="#fff" fontSize="10" textAnchor="middle">{leftElectrode.symbol} Electrode</text>
              <text x="80" y="215" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">1.0 M {leftElectrode.symbol}²⁺</text>

              {/* Right Beaker (Cathode side) */}
              <rect x="280" y="110" width="80" height="90" rx="5" fill="rgba(255, 71, 87, 0.1)" stroke="rgba(255,255,255,0.2)" />
              <rect x="310" y="80" width="20" height="80" fill={rightElectrode.color} stroke="rgba(255,255,255,0.3)" />
              <text x="320" y="190" fill="#fff" fontSize="10" textAnchor="middle">{rightElectrode.symbol} Electrode</text>
              <text x="320" y="215" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">1.0 M {rightElectrode.symbol}²⁺</text>

              {/* Salt Bridge */}
              <path d="M 100,130 L 100,90 L 300,90 L 300,130" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="12" strokeLinecap="square" />
              <path d="M 100,130 L 100,90 L 300,90 L 300,130" fill="none" stroke="#2ed573" strokeWidth="6" strokeLinecap="square" opacity="0.6" />
              <text x="200" y="110" fill="#2ed573" fontSize="9" textAnchor="middle">KNO₃ Salt Bridge</text>
            </svg>
          </div>

          {/* Configuration panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff' }} className="electro-config-card">
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00f2fe' }}>Galvanic Cell Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px', opacity: 0.8 }}>Left Metal (Anode/Oxidation):</label>
                <select
                  value={ELECTRODES.findIndex(e => e.symbol === leftElectrode.symbol)}
                  onChange={(e) => setLeftElectrode(ELECTRODES[parseInt(e.target.value)])}
                  style={{ width: '100%', background: '#2f3542', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px' }}
                  className="electro-select-left"
                >
                  {ELECTRODES.map((el, i) => (
                    <option key={el.symbol} value={i}>{el.name} (E° = {el.E0}V)</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px', opacity: 0.8 }}>Right Metal (Cathode/Reduction):</label>
                <select
                  value={ELECTRODES.findIndex(e => e.symbol === rightElectrode.symbol)}
                  onChange={(e) => setRightElectrode(ELECTRODES[parseInt(e.target.value)])}
                  style={{ width: '100%', background: '#2f3542', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px' }}
                  className="electro-select-right"
                >
                  {ELECTRODES.map((el, i) => (
                    <option key={el.symbol} value={i}>{el.name} (E° = {el.E0}V)</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }} className="reduction-potentials-info">
              <strong style={{ display: 'block', marginBottom: '6px', color: '#00f2fe' }}>Reaction Thermodynamics</strong>
              <div>Oxidation (Anode): {leftElectrode.symbol} ➔ {leftElectrode.symbol}²⁺ + 2e⁻</div>
              <div>Reduction (Cathode): {rightElectrode.symbol}²⁺ + 2e⁻ ➔ {rightElectrode.symbol}</div>
              <div style={{ marginTop: '8px', color: parseFloat(cellPotential) >= 0 ? '#2ed573' : '#ff4757' }}>
                Type: <strong>{parseFloat(cellPotential) >= 0 ? 'Spontaneous Galvanic (ΔG < 0)' : 'Non-Spontaneous Electrolytic'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GAS LAWS LAB COMPONENT */}
      {activeSubTab === 'gas' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Piston SVG Display */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg viewBox="0 0 200 240" style={{ width: '100%', maxWidth: '240px', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'visible' }}>
              {/* Cylinder walls */}
              <line x1="10" y1="40" x2="10" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <line x1="190" y1="40" x2="190" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <line x1="10" y1="220" x2="190" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />

              {/* Movable Piston shaft and head */}
              {(() => {
                const pistonY = 220 - (vol * 0.9);
                return (
                  <g>
                    {/* Shaft */}
                    <rect x="92" y="10" width="16" height={pistonY} fill="rgba(255,255,255,0.4)" />
                    {/* Head plate */}
                    <rect x="12" y={pistonY} width="176" height="15" fill="#747d8c" stroke="#fff" strokeWidth="1" />
                    {/* Weights on top of piston to represent pressure in charles law */}
                    {gasMode === 'charles' && (
                      <rect x="75" y={pistonY - 12} width="50" height="12" fill="#ffa502" rx="2" />
                    )}
                  </g>
                );
              })()}

              {/* Gas Particle Circles */}
              {particles.map((p) => (
                <circle key={p.id} cx={p.x} cy={p.y} r="5" fill="#ff4757" style={{ filter: 'drop-shadow(0 0 2px #ff4757)' }} />
              ))}
            </svg>
          </div>

          {/* Slider controls card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff' }} className="gas-config-card">
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00f2fe' }}>Gas Parameters</h3>
            
            {/* Mode selection */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setGasMode('boyle'); setTemp(300); }}
                style={{ flex: 1, background: gasMode === 'boyle' ? '#00f2fe' : 'rgba(255,255,255,0.05)', color: gasMode === 'boyle' ? '#000' : '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                className="gas-mode-boyle-btn"
              >
                Boyle's Law (Const T)
              </button>
              <button
                onClick={() => { setGasMode('charles'); }}
                style={{ flex: 1, background: gasMode === 'charles' ? '#00f2fe' : 'rgba(255,255,255,0.05)', color: gasMode === 'charles' ? '#000' : '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                className="gas-mode-charles-btn"
              >
                Charles's Law (Const P)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Temperature slider (disabled in boyle constant temp) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Temperature (T):</span>
                  <span>{temp} K</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="500"
                  value={temp}
                  disabled={gasMode === 'boyle'}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                  className="gas-slider-temp"
                />
              </div>

              {/* Volume slider (disabled in charles where volume is function of temperature V ~ T) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Volume (V):</span>
                  <span>{vol} L</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={vol}
                  disabled={gasMode === 'charles'}
                  onChange={(e) => setVol(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                  className="gas-slider-vol"
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div>Calculated Pressure (P): <strong>{pressure} kPa</strong></div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>
                  {gasMode === 'boyle' 
                    ? 'As volume decreases, gas particle collision frequency with walls increases (Boyle\'s Law).' 
                    : 'As temperature increases, particles speed up and expand the volume to maintain constant pressure (Charles\'s Law).'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACID-BASE TITRATION LAB COMPONENT */}
      {activeSubTab === 'titration' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Beaker and Titration curve visual split */}
          <div style={{ display: 'flex', gap: '16px', width: '100%' }} className="titration-beaker-layout">
            
            {/* Beaker SVG */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 140px' }}>
              <svg viewBox="0 0 100 220" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* Burette holding NaOH */}
                <rect x="45" y="10" width="10" height="90" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" />
                <rect x="45" y="100" width="10" height="15" fill="#747d8c" />
                
                {/* Dropping water indicator */}
                {NaOHVolume > 0 && (
                  <circle cx="50" cy="120" r="2.5" fill="#00f2fe" opacity="0.7" />
                )}

                {/* Beaker fluid filled based on indicator color */}
                <rect x="25" y="140" width="50" height="60" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <rect x="27" y="155" width="46" height="43" rx="2" fill={indicatorColor} style={{ transition: 'fill 0.2s ease' }} />
                
                <text x="50" y="180" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">pH {currentPH}</text>
              </svg>
            </div>

            {/* Titration Curve Chart */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#fff' }}>pH Titration Curve</h3>
              <svg viewBox="0 0 220 150" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.1)', overflow: 'visible' }}>
                {/* Axes */}
                <line x1="25" y1="5" x2="25" y2="135" stroke="rgba(255,255,255,0.2)" />
                <line x1="25" y1="135" x2="215" y2="135" stroke="rgba(255,255,255,0.2)" />

                {/* Y labels (pH 1 to 14) */}
                {[1, 7, 14].map(yVal => {
                  const y = 135 - (yVal / 14) * 125;
                  return (
                    <g key={yVal}>
                      <text x="20" y={y + 3} fill="rgba(255,255,255,0.5)" textAnchor="end" style={{ fontSize: '7px' }}>{yVal}</text>
                    </g>
                  );
                })}

                {/* X labels (NaOH Volume 0 to 50) */}
                {[0, 25, 50].map(xVal => {
                  const x = 25 + (xVal / 50) * 180;
                  return (
                    <g key={xVal}>
                      <text x={x} y="145" fill="rgba(255,255,255,0.5)" textAnchor="middle" style={{ fontSize: '7px' }}>{xVal} mL</text>
                    </g>
                  );
                })}

                {/* Plot line */}
                {titrationHistory.length >= 2 && (() => {
                  const points = titrationHistory.map(h => {
                    const x = 25 + (h.vol / 50) * 180;
                    const y = 135 - (h.pH / 14) * 125;
                    return `${x},${y}`;
                  }).join(' ');
                  return <polyline points={points} fill="none" stroke="#00f2fe" strokeWidth="2" />;
                })()}

                {/* Dot for equivalence point at 25 mL */}
                {NaOHVolume >= 25 && (
                  <circle cx={25 + (25/50)*180} cy={135 - (7/14)*125} r="3" fill="#ff4757" />
                )}
              </svg>
            </div>

          </div>

          {/* Action and statistics panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00f2fe' }}>Titration Controls</h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => addDrop(0.5)}
                disabled={NaOHVolume >= 50}
                style={{ flex: 1, background: '#ff4757', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                className="titrate-add-drop-btn"
              >
                +0.5 mL NaOH
              </button>
              <button
                onClick={() => addDrop(5.0)}
                disabled={NaOHVolume >= 50}
                style={{ flex: 1, background: '#ffa502', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                className="titrate-add-fast-btn"
              >
                +5.0 mL NaOH
              </button>
            </div>

            <button
              onClick={resetTitration}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
              className="titrate-reset-btn"
            >
              Reset Titration
            </button>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }} className="titration-stats-card">
              <div>Total NaOH Titrant: <strong>{NaOHVolume.toFixed(1)} mL</strong></div>
              <div>Current pH Reading: <strong style={{ color: '#00f2fe' }}>{currentPH}</strong></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>
                Analyte: 50.0 mL of 0.1 M HCl. Equivalence point is reached when exactly 25.0 mL of 0.1 M NaOH is added.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
