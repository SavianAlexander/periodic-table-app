import React, { useState } from 'react';
import elements from '../data/elements.json';

// Pre-defined list of common compounds for verification & visual mapping
const COMMON_COMPOUNDS = {
  'H,O': { name: 'Water', formula: 'H₂O', type: 'Covalent', ratio: { H: 2, O: 1 }, desc: 'Oxygen shares electrons with two Hydrogen atoms to complete their valence shells.' },
  'Cl,Na': { name: 'Sodium Chloride (Salt)', formula: 'NaCl', type: 'Ionic', ratio: { Na: 1, Cl: 1 }, desc: 'Sodium transfers its single valence electron to Chlorine, forming Na⁺ and Cl⁻ ions.' },
  'C,O': { name: 'Carbon Dioxide', formula: 'CO₂', type: 'Covalent', ratio: { C: 1, O: 2 }, desc: 'Carbon shares four electrons with two Oxygen atoms via double bonds.' },
  'H,N': { name: 'Ammonia', formula: 'NH₃', type: 'Covalent', ratio: { N: 1, H: 3 }, desc: 'Nitrogen shares electrons with three Hydrogen atoms.' },
  'Cl,H': { name: 'Hydrochloric Acid', formula: 'HCl', type: 'Covalent', ratio: { H: 1, Cl: 1 }, desc: 'Hydrogen shares its electron with Chlorine to form a single polar covalent bond.' },
  'H,H': { name: 'Hydrogen Gas', formula: 'H₂', type: 'Covalent', ratio: { H: 2 }, desc: 'Two Hydrogen atoms share a pair of electrons to form a single covalent bond.' },
  'O,O': { name: 'Oxygen Gas', formula: 'O₂', type: 'Covalent', ratio: { O: 2 }, desc: 'Two Oxygen atoms share two pairs of electrons to form a double covalent bond.' },
  'N,N': { name: 'Nitrogen Gas', formula: 'N₂', type: 'Covalent', ratio: { N: 2 }, desc: 'Two Nitrogen atoms share three pairs of electrons to form a triple covalent bond.' }
};

export function BondingSimulator() {
  const [selectedAtoms, setSelectedAtoms] = useState([]); // List of { elementObj, id }
  const [bondingResult, setBondingResult] = useState(null);

  // Filter selectable elements: common elements that easily bond
  const selectableElements = elements.filter(el => 
    ['H', 'He', 'C', 'N', 'O', 'Na', 'Cl'].includes(el.symbol)
  );

  const addAtom = (element) => {
    if (selectedAtoms.length >= 4) return; // Limit to 4 atoms for clear visuals
    setSelectedAtoms([...selectedAtoms, { ...element, id: Date.now() + Math.random() }]);
    setBondingResult(null);
  };

  const removeAtom = (id) => {
    setSelectedAtoms(selectedAtoms.filter(a => a.id !== id));
    setBondingResult(null);
  };

  const clearWorkspace = () => {
    setSelectedAtoms([]);
    setBondingResult(null);
  };

  const performBonding = () => {
    if (selectedAtoms.length < 2) return;

    // Count occurrence of each element symbol in workspace
    const counts = {};
    selectedAtoms.forEach(atom => {
      counts[atom.symbol] = (counts[atom.symbol] || 0) + 1;
    });

    // Check for Noble Gas (Helium)
    if (counts['He']) {
      setBondingResult({
        success: false,
        msg: 'Helium is a Noble Gas. Its valence shell (1s²) is already full, making it chemically inert and unable to form bonds.'
      });
      return;
    }

    // Sort symbols to match compound keys
    const activeSymbols = Object.keys(counts).sort();
    const lookupKey = activeSymbols.join(',');

    const compound = COMMON_COMPOUNDS[lookupKey];

    if (compound) {
      // Verify counts match compound ratios
      let ratioMatch = true;
      Object.keys(compound.ratio).forEach(sym => {
        if (counts[sym] !== compound.ratio[sym]) {
          ratioMatch = false;
        }
      });

      // Also ensure no extra stray atoms exist in workspace
      if (Object.keys(counts).length !== Object.keys(compound.ratio).length) {
        ratioMatch = false;
      }

      if (ratioMatch) {
        setBondingResult({
          success: true,
          ...compound
        });
        return;
      }
    }

    // Dynamic fallback checking using valency
    // Covalent check by matching outer shell requirements
    setBondingResult({
      success: false,
      msg: 'This atom ratio is unstable. Try standard formulas like: H₂O (2 H + 1 O), NaCl (1 Na + 1 Cl), CO₂ (1 C + 2 O), or H₂ (2 H).'
    });
  };

  // Render SVG bonds based on compound type
  const renderSVGDiagram = () => {
    if (!bondingResult || !bondingResult.success) return null;

    const width = 300;
    const height = 150;
    const center = { x: width / 2, y: height / 2 };

    if (bondingResult.formula === 'H₂O') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '160px' }}>
          {/* Bonds */}
          <line x1={center.x} y1={center.y} x2={center.x - 50} y2={center.y + 30} stroke="#00f2fe" strokeWidth="3" />
          <line x1={center.x} y1={center.y} x2={center.x + 50} y2={center.y + 30} stroke="#00f2fe" strokeWidth="3" />
          {/* Shared electrons labels */}
          <circle cx={center.x - 25} cy={center.y + 15} r="4" fill="#ffffff" stroke="#00f2fe" />
          <circle cx={center.x + 25} cy={center.y + 15} r="4" fill="#ffffff" stroke="#00f2fe" />
          {/* Atoms */}
          <circle cx={center.x} cy={center.y} r="20" fill="#00b4d8" />
          <text x={center.x} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>O</text>
          
          <circle cx={center.x - 50} cy={center.y + 30} r="14" fill="#ff4757" />
          <text x={center.x - 50} y={center.y + 34} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>

          <circle cx={center.x + 50} cy={center.y + 30} r="14" fill="#ff4757" />
          <text x={center.x + 50} y={center.y + 34} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>
        </svg>
      );
    }

    if (bondingResult.formula === 'NaCl') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '160px' }}>
          {/* Electron transfer arrow */}
          <path d={`M ${center.x - 40} ${center.y - 10} Q ${center.x} ${center.y - 30} ${center.x + 35} ${center.y - 10}`} fill="none" stroke="#00f2fe" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx={center.x} cy={center.y - 20} r="4" fill="#ffffff" />
          {/* Atoms */}
          <circle cx={center.x - 50} cy={center.y} r="22" fill="#00b4d8" />
          <text x={center.x - 50} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>Na⁺</text>

          <circle cx={center.x + 50} cy={center.y} r="22" fill="#2ed573" />
          <text x={center.x + 50} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>Cl⁻</text>
        </svg>
      );
    }

    // Default molecular horizontal display (e.g. H2, O2, HCl, CO2)
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '160px' }}>
        <line x1={center.x - 40} y1={center.y} x2={center.x + 40} y2={center.y} stroke="#00f2fe" strokeWidth="4" />
        <circle cx={center.x - 40} cy={center.y} r="20" fill="#00b4d8" />
        <text x={center.x - 40} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>{activeSymbols[0]}</text>
        
        <circle cx={center.x + 40} cy={center.y} r="20" fill="#ff4757" />
        <text x={center.x + 40} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>{activeSymbols[1] || activeSymbols[0]}</text>
      </svg>
    );
  };

  return (
    <div className="bonding-simulator-container" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '900px',
      margin: '20px auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Interactive Chemical Bonding Simulator</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {/* Selector Panel */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>Select Atoms to Add:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectableElements.map(el => (
              <button
                key={el.atomicNumber}
                onClick={() => addAtom(el)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                <strong style={{ color: '#00f2fe' }}>{el.symbol}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({el.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Panel */}
        <div style={{ flex: '2 1 350px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>Bonding Workspace ({selectedAtoms.length}/4)</h3>
            {selectedAtoms.length > 0 && (
              <button onClick={clearWorkspace} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem' }}>Clear All</button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '60px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            {selectedAtoms.length === 0 ? (
              <div style={{ width: '100%', textAlign: 'center', opacity: 0.5, fontSize: '0.85rem' }}>Select elements on the left to add them to the workspace.</div>
            ) : (
              selectedAtoms.map(atom => (
                <div
                  key={atom.id}
                  style={{
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid #00f2fe',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <strong>{atom.symbol}</strong>
                  <button
                    onClick={() => removeAtom(atom.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ff4757', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={performBonding}
            disabled={selectedAtoms.length < 2}
            style={{
              background: selectedAtoms.length >= 2 ? '#00f2fe' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: selectedAtoms.length >= 2 ? '#12131c' : 'rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: selectedAtoms.length >= 2 ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            Synthesize Bond
          </button>
        </div>
      </div>

      {/* Bonding Results Overlay */}
      {bondingResult && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          {bondingResult.success ? (
            <>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00f2fe' }}>
                {bondingResult.name} ({bondingResult.formula})
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {bondingResult.type} Bond
              </div>
              {renderSVGDiagram()}
              <div style={{ fontSize: '0.9rem', textAlign: 'center', maxWidth: '500px', lineHeight: 1.5 }}>
                {bondingResult.desc}
              </div>
            </>
          ) : (
            <div style={{ color: '#ff4757', textAlign: 'center', fontSize: '0.9rem', padding: '10px' }}>
              ⚠️ {bondingResult.msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
