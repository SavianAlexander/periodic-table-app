import React, { useState } from 'react';
import elements from '../data/elements.json';

// Pre-defined list of common compounds for verification & visual mapping
const COMMON_COMPOUNDS = {
  'H,O': { 
    name: 'Water', 
    formula: 'H₂O', 
    type: 'Covalent', 
    vsepr: 'Bent', 
    angle: '104.5°', 
    ratio: { H: 2, O: 1 }, 
    desc: 'Oxygen shares electrons with two Hydrogen atoms. The two lone pairs on Oxygen exert repulsion, bending the H-O-H bond angle to 104.5°.' 
  },
  'Cl,Na': { 
    name: 'Sodium Chloride (Salt)', 
    formula: 'NaCl', 
    type: 'Ionic', 
    vsepr: 'Ionic Crystal Lattice', 
    angle: 'N/A (Lattice)', 
    ratio: { Na: 1, Cl: 1 }, 
    desc: 'Sodium transfers its single valence electron to Chlorine, forming Na⁺ (cation) and Cl⁻ (anion). They are held together by strong electrostatic attraction.' 
  },
  'C,O': { 
    name: 'Carbon Dioxide', 
    formula: 'CO₂', 
    type: 'Covalent', 
    vsepr: 'Linear', 
    angle: '180°', 
    ratio: { C: 1, O: 2 }, 
    desc: 'Carbon forms two double covalent bonds with two Oxygen atoms. The bonding pairs repel each other to opposite sides, creating a linear 180° geometry.' 
  },
  'H,N': { 
    name: 'Ammonia', 
    formula: 'NH₃', 
    type: 'Covalent', 
    vsepr: 'Trigonal Pyramidal', 
    angle: '107°', 
    ratio: { N: 1, H: 3 }, 
    desc: 'Nitrogen shares single bonds with three Hydrogen atoms. A single lone pair at the apex pushes the bonds downward, resulting in a trigonal pyramidal shape.' 
  },
  'Cl,H': { 
    name: 'Hydrochloric Acid', 
    formula: 'HCl', 
    type: 'Covalent', 
    vsepr: 'Linear', 
    angle: '180°', 
    ratio: { H: 1, Cl: 1 }, 
    desc: 'Hydrogen shares its single electron with Chlorine to form a polar covalent bond. The molecule contains 3 lone pairs on the Chlorine atom.' 
  },
  'H,H': { 
    name: 'Hydrogen Gas', 
    formula: 'H₂', 
    type: 'Covalent', 
    vsepr: 'Linear', 
    angle: '180°', 
    ratio: { H: 2 }, 
    desc: 'Two Hydrogen atoms share their single electrons to form a stable, non-polar single covalent bond.' 
  },
  'O,O': { 
    name: 'Oxygen Gas', 
    formula: 'O₂', 
    type: 'Covalent', 
    vsepr: 'Linear', 
    angle: '180°', 
    ratio: { O: 2 }, 
    desc: 'Two Oxygen atoms share two pairs of valence electrons, completing their octets via a double covalent bond.' 
  },
  'N,N': { 
    name: 'Nitrogen Gas', 
    formula: 'N₂', 
    type: 'Covalent', 
    vsepr: 'Linear', 
    angle: '180°', 
    ratio: { N: 2 }, 
    desc: 'Two Nitrogen atoms share three pairs of valence electrons to form an extremely strong triple covalent bond.' 
  }
};

export function BondingSimulator() {
  const [selectedAtoms, setSelectedAtoms] = useState([]); // List of { elementObj, id }
  const [bondingResult, setBondingResult] = useState(null);

  const selectableElements = elements.filter(el => 
    ['H', 'He', 'C', 'N', 'O', 'Na', 'Cl'].includes(el.symbol)
  );

  const addAtom = (element) => {
    if (selectedAtoms.length >= 4) return;
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

    const counts = {};
    selectedAtoms.forEach(atom => {
      counts[atom.symbol] = (counts[atom.symbol] || 0) + 1;
    });

    if (counts['He']) {
      setBondingResult({
        success: false,
        msg: 'Helium is a Noble Gas. Its valence shell (1s²) is already full, making it chemically inert and unable to form bonds.'
      });
      return;
    }

    const activeSymbols = Object.keys(counts).sort();
    const lookupKey = activeSymbols.join(',');
    const compound = COMMON_COMPOUNDS[lookupKey];

    if (compound) {
      let ratioMatch = true;
      Object.keys(compound.ratio).forEach(sym => {
        if (counts[sym] !== compound.ratio[sym]) {
          ratioMatch = false;
        }
      });

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

    setBondingResult({
      success: false,
      msg: 'This atom ratio is unstable. Try standard formulas like: H₂O (2 H + 1 O), NaCl (1 Na + 1 Cl), CO₂ (1 C + 2 O), or H₂ (2 H).'
    });
  };

  // Render SVG diagrams with Lewis Dot structure overlays
  const renderSVGDiagram = () => {
    if (!bondingResult || !bondingResult.success) return null;

    const width = 320;
    const height = 160;
    const center = { x: width / 2, y: height / 2 };

    const renderDot = (cx, cy) => (
      <circle cx={cx} cy={cy} r="2.5" fill="#2ed573" />
    );

    if (bondingResult.formula === 'H₂O') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '180px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}>
          {/* Bonds */}
          <line x1={center.x} y1={center.y} x2={center.x - 50} y2={center.y + 40} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
          <line x1={center.x} y1={center.y} x2={center.x + 50} y2={center.y + 40} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
          
          {/* Shared Electrons on bonds */}
          {renderDot(center.x - 22, center.y + 18)}
          {renderDot(center.x - 27, center.y + 22)}
          
          {renderDot(center.x + 22, center.y + 18)}
          {renderDot(center.x + 27, center.y + 22)}

          {/* Lone pairs on Oxygen */}
          {/* Top lone pair */}
          {renderDot(center.x - 5, center.y - 23)}
          {renderDot(center.x + 5, center.y - 23)}
          {/* Left-top lone pair */}
          {renderDot(center.x - 22, center.y - 10)}
          {renderDot(center.x - 18, center.y - 18)}

          {/* Atom Nodes */}
          <circle cx={center.x} cy={center.y} r="18" fill="#00b4d8" />
          <text x={center.x} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>O</text>
          
          <circle cx={center.x - 50} cy={center.y + 40} r="12" fill="#ff4757" />
          <text x={center.x - 50} y={center.y + 43} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>

          <circle cx={center.x + 50} cy={center.y + 40} r="12" fill="#ff4757" />
          <text x={center.x + 50} y={center.y + 43} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>
          
          {/* Angle indicator */}
          <path d={`M ${center.x - 15} ${center.y + 12} Q ${center.x} ${center.y + 20} ${center.x + 15} ${center.y + 12}`} fill="none" stroke="#ffb86c" strokeWidth="1.5" />
          <text x={center.x} y={center.y + 32} textAnchor="middle" fill="#ffb86c" style={{ fontSize: '9px', fontWeight: 'bold' }}>104.5°</text>
        </svg>
      );
    }

    if (bondingResult.formula === 'NaCl') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '180px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}>
          {/* Electron transfer representation */}
          <path d={`M ${center.x - 45} ${center.y - 15} Q ${center.x} ${center.y - 35} ${center.x + 25} ${center.y - 15}`} fill="none" stroke="#2ed573" strokeWidth="2" strokeDasharray="4 4" />
          {renderDot(center.x - 10, center.y - 28)}
          
          {/* Cation Na+ */}
          <circle cx={center.x - 50} cy={center.y} r="20" fill="#00b4d8" />
          <text x={center.x - 50} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>Na⁺</text>

          {/* Anion Cl- with Octet dots */}
          <circle cx={center.x + 50} cy={center.y} r="20" fill="#2ed573" />
          <text x={center.x + 50} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>Cl</text>

          {/* Cl Octet dots */}
          {renderDot(center.x + 45, center.y - 23)}
          {renderDot(center.x + 55, center.y - 23)}
          
          {renderDot(center.x + 45, center.y + 23)}
          {renderDot(center.x + 55, center.y + 23)}
          
          {renderDot(center.x + 27, center.y - 5)}
          {renderDot(center.x + 27, center.y + 5)}
          
          {renderDot(center.x + 73, center.y - 5)}
          {renderDot(center.x + 73, center.y + 5)}
          
          {/* Brackets for Ionic representation */}
          <path d={`M ${center.x + 20} ${center.y - 24} L ${center.x + 18} ${center.y - 24} L ${center.x + 18} ${center.y + 24} L ${center.x + 20} ${center.y + 24}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d={`M ${center.x + 76} ${center.y - 24} L ${center.x + 78} ${center.y - 24} L ${center.x + 78} ${center.y + 24} L ${center.x + 76} ${center.y + 24}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <text x={center.x + 83} y={center.y - 12} fill="#fff" style={{ fontSize: '11px', fontWeight: 'bold' }}>⁻</text>
        </svg>
      );
    }

    if (bondingResult.formula === 'CO₂') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '180px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}>
          {/* Double Bonds */}
          <line x1={center.x - 60} y1={center.y - 4} x2={center.x + 60} y2={center.y - 4} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1={center.x - 60} y1={center.y + 4} x2={center.x + 60} y2={center.y + 4} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

          {/* Shared Double Bond Dots */}
          {renderDot(center.x - 30, center.y - 8)}
          {renderDot(center.x - 30, center.y + 8)}
          {renderDot(center.x - 22, center.y - 8)}
          {renderDot(center.x - 22, center.y + 8)}

          {renderDot(center.x + 22, center.y - 8)}
          {renderDot(center.x + 22, center.y + 8)}
          {renderDot(center.x + 30, center.y - 8)}
          {renderDot(center.x + 30, center.y + 8)}

          {/* Oxygen lone pairs */}
          {renderDot(center.x - 78, center.y - 12)}
          {renderDot(center.x - 70, center.y - 20)}
          {renderDot(center.x - 78, center.y + 12)}
          {renderDot(center.x - 70, center.y + 20)}

          {renderDot(center.x + 78, center.y - 12)}
          {renderDot(center.x + 70, center.y - 20)}
          {renderDot(center.x + 78, center.y + 12)}
          {renderDot(center.x + 70, center.y + 20)}

          {/* Atoms */}
          <circle cx={center.x} cy={center.y} r="18" fill="#00b4d8" />
          <text x={center.x} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>C</text>

          <circle cx={center.x - 60} cy={center.y} r="18" fill="#ff4757" />
          <text x={center.x - 60} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>O</text>

          <circle cx={center.x + 60} cy={center.y} r="18" fill="#ff4757" />
          <text x={center.x + 60} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>O</text>
        </svg>
      );
    }

    if (bondingResult.formula === 'NH₃') {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '180px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}>
          {/* Bonds */}
          <line x1={center.x} y1={center.y - 10} x2={center.x - 50} y2={center.y + 30} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1={center.x} y1={center.y - 10} x2={center.x + 50} y2={center.y + 30} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1={center.x} y1={center.y - 10} x2={center.x} y2={center.y + 45} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

          {/* Shared Dots */}
          {renderDot(center.x - 22, center.y + 8)}
          {renderDot(center.x - 27, center.y + 12)}
          
          {renderDot(center.x + 22, center.y + 8)}
          {renderDot(center.x + 27, center.y + 12)}

          {renderDot(center.x - 5, center.y + 20)}
          {renderDot(center.x + 5, center.y + 20)}

          {/* Nitrogen Top lone pair */}
          {renderDot(center.x - 5, center.y - 32)}
          {renderDot(center.x + 5, center.y - 32)}

          {/* Atoms */}
          <circle cx={center.x} cy={center.y - 10} r="18" fill="#00b4d8" />
          <text x={center.x} y={center.y - 6} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>N</text>

          <circle cx={center.x - 50} cy={center.y + 30} r="12" fill="#ff4757" />
          <text x={center.x - 50} y={center.y + 33} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>

          <circle cx={center.x + 50} cy={center.y + 30} r="12" fill="#ff4757" />
          <text x={center.x + 50} y={center.y + 33} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>

          <circle cx={center.x} cy={center.y + 45} r="12" fill="#ff4757" />
          <text x={center.x} y={center.y + 48} textAnchor="middle" fill="#fff" style={{ fontSize: '10px', fontWeight: 'bold' }}>H</text>
        </svg>
      );
    }

    // Default horizontal molecular diagrams (HCl, H2, O2, N2)
    const isDouble = bondingResult.formula === 'O₂';
    const isTriple = bondingResult.formula === 'N₂';
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '180px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}>
        {isTriple ? (
          <>
            <line x1={center.x - 40} y1={center.y - 6} x2={center.x + 40} y2={center.y - 6} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <line x1={center.x - 40} y1={center.y} x2={center.x + 40} y2={center.y} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <line x1={center.x - 40} y1={center.y + 6} x2={center.x + 40} y2={center.y + 6} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* Triple bond shared pairs */}
            {renderDot(center.x - 6, center.y - 8)}
            {renderDot(center.x + 6, center.y - 8)}
            {renderDot(center.x - 6, center.y)}
            {renderDot(center.x + 6, center.y)}
            {renderDot(center.x - 6, center.y + 8)}
            {renderDot(center.x + 6, center.y + 8)}
          </>
        ) : isDouble ? (
          <>
            <line x1={center.x - 40} y1={center.y - 3} x2={center.x + 40} y2={center.y - 3} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <line x1={center.x - 40} y1={center.y + 3} x2={center.x + 40} y2={center.y + 3} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* Double bond shared pairs */}
            {renderDot(center.x - 6, center.y - 5)}
            {renderDot(center.x + 6, center.y - 5)}
            {renderDot(center.x - 6, center.y + 5)}
            {renderDot(center.x + 6, center.y + 5)}
          </>
        ) : (
          <>
            <line x1={center.x - 40} y1={center.y} x2={center.x + 40} y2={center.y} stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
            {/* Single bond shared pairs */}
            {renderDot(center.x - 5, y => center.y - 4)}
            {renderDot(center.x - 5, y => center.y + 4)}
            {renderDot(center.x, center.y - 5)}
            {renderDot(center.x, center.y + 5)}
          </>
        )}

        {/* Atom 1 */}
        <circle cx={center.x - 40} cy={center.y} r="18" fill="#00b4d8" />
        <text x={center.x - 40} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>{bondingResult.formula[0]}</text>
        
        {/* Atom 2 */}
        <circle cx={center.x + 40} cy={center.y} r="18" fill="#ff4757" />
        <text x={center.x + 40} y={center.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: '12px', fontWeight: 'bold' }}>{bondingResult.formula.includes('₂') ? bondingResult.formula[0] : (bondingResult.formula.replace(/[₂]/g, '')[1] || bondingResult.formula.replace(/[₂]/g, '')[0])}</text>

        {/* Outer lone pairs on Cl in HCl */}
        {bondingResult.formula === 'HCl' && (
          <>
            {renderDot(center.x + 35, center.y - 23)}
            {renderDot(center.x + 45, center.y - 23)}
            {renderDot(center.x + 35, center.y + 23)}
            {renderDot(center.x + 45, center.y + 23)}
            {renderDot(center.x + 63, center.y - 5)}
            {renderDot(center.x + 63, center.y + 5)}
          </>
        )}

        {/* Lone pairs on Oxygen O2 */}
        {bondingResult.formula === 'O₂' && (
          <>
            {renderDot(center.x - 58, center.y - 12)}
            {renderDot(center.x - 50, center.y - 20)}
            {renderDot(center.x - 58, center.y + 12)}
            {renderDot(center.x - 50, center.y + 20)}

            {renderDot(center.x + 58, center.y - 12)}
            {renderDot(center.x + 50, center.y - 20)}
            {renderDot(center.x + 58, center.y + 12)}
            {renderDot(center.x + 50, center.y + 20)}
          </>
        )}

        {/* Lone pairs on Nitrogen N2 */}
        {bondingResult.formula === 'N₂' && (
          <>
            {renderDot(center.x - 63, center.y - 5)}
            {renderDot(center.x - 63, center.y + 5)}
            {renderDot(center.x + 63, center.y - 5)}
            {renderDot(center.x + 63, center.y + 5)}
          </>
        )}
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
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', margin: '4px 0' }}>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                  <strong style={{ color: '#ffb86c' }}>VSEPR Shape:</strong> {bondingResult.vsepr}
                </span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                  <strong style={{ color: '#00f2fe' }}>Ideal Angle:</strong> {bondingResult.angle}
                </span>
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
