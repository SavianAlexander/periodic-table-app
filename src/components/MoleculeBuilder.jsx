import React, { useState, useEffect, useRef, useMemo } from 'react';

const ATOM_TYPES = {
  C: { element: 'C', name: 'Carbon', valency: 4, color: '#2f3542', radius: 18, textColor: '#fff' },
  H: { element: 'H', name: 'Hydrogen', valency: 1, color: '#f1f2f6', radius: 12, textColor: '#2f3542' },
  O: { element: 'O', name: 'Oxygen', valency: 2, color: '#ff4757', radius: 16, textColor: '#fff' },
  N: { element: 'N', name: 'Nitrogen', valency: 3, color: '#3742fa', radius: 17, textColor: '#fff' }
};

const TEMPLATES = [
  {
    name: 'Water (H₂O)',
    formula: 'H₂O',
    atoms: [
      { id: 1, element: 'O', x: 150, y: 120 },
      { id: 2, element: 'H', x: 100, y: 80 },
      { id: 3, element: 'H', x: 200, y: 80 }
    ],
    bonds: [
      { atom1Id: 1, atom2Id: 2, order: 1 },
      { atom1Id: 1, atom2Id: 3, order: 1 }
    ]
  },
  {
    name: 'Carbon Dioxide (CO₂)',
    formula: 'CO₂',
    atoms: [
      { id: 1, element: 'C', x: 150, y: 120 },
      { id: 2, element: 'O', x: 90, y: 120 },
      { id: 3, element: 'O', x: 210, y: 120 }
    ],
    bonds: [
      { atom1Id: 1, atom2Id: 2, order: 2 },
      { atom1Id: 1, atom2Id: 3, order: 2 }
    ]
  },
  {
    name: 'Methane (CH₄)',
    formula: 'CH₄',
    atoms: [
      { id: 1, element: 'C', x: 150, y: 120 },
      { id: 2, element: 'H', x: 150, y: 60 },
      { id: 3, element: 'H', x: 90, y: 120 },
      { id: 4, element: 'H', x: 150, y: 180 },
      { id: 5, element: 'H', x: 210, y: 120 }
    ],
    bonds: [
      { atom1Id: 1, atom2Id: 2, order: 1 },
      { atom1Id: 1, atom2Id: 3, order: 1 },
      { atom1Id: 1, atom2Id: 4, order: 1 },
      { atom1Id: 1, atom2Id: 5, order: 1 }
    ]
  },
  {
    name: 'Formaldehyde (CH₂O)',
    formula: 'CH₂O',
    atoms: [
      { id: 1, element: 'C', x: 150, y: 120 },
      { id: 2, element: 'O', x: 150, y: 60 },
      { id: 3, element: 'H', x: 95, y: 165 },
      { id: 4, element: 'H', x: 205, y: 165 }
    ],
    bonds: [
      { atom1Id: 1, atom2Id: 2, order: 2 },
      { atom1Id: 1, atom2Id: 3, order: 1 },
      { atom1Id: 1, atom2Id: 4, order: 1 }
    ]
  },
  {
    name: 'Ammonia (NH₃)',
    formula: 'NH₃',
    atoms: [
      { id: 1, element: 'N', x: 150, y: 120 },
      { id: 2, element: 'H', x: 150, y: 60 },
      { id: 3, element: 'H', x: 95, y: 155 },
      { id: 4, element: 'H', x: 205, y: 155 }
    ],
    bonds: [
      { atom1Id: 1, atom2Id: 2, order: 1 },
      { atom1Id: 1, atom2Id: 3, order: 1 },
      { atom1Id: 1, atom2Id: 4, order: 1 }
    ]
  }
];

export function MoleculeBuilder() {
  const [atoms, setAtoms] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [selectedAtomId, setSelectedAtomId] = useState(null);
  
  // Drag state
  const [draggingAtomId, setDraggingAtomId] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Counter to generate unique IDs
  const nextIdRef = useRef(1);

  // Calculate actual bound configurations and counts
  const bondingStats = useMemo(() => {
    // Count bonds for each atom
    const counts = {};
    atoms.forEach(a => {
      counts[a.id] = 0;
    });

    bonds.forEach(b => {
      if (counts[b.atom1Id] !== undefined) counts[b.atom1Id] += b.order;
      if (counts[b.atom2Id] !== undefined) counts[b.atom2Id] += b.order;
    });

    // Check if all valences are fully satisfied
    let allSatisfied = atoms.length > 0;
    const details = atoms.map(a => {
      const type = ATOM_TYPES[a.element];
      const bonded = counts[a.id] || 0;
      const remaining = type.valency - bonded;
      if (remaining !== 0) allSatisfied = false;
      return { id: a.id, element: a.element, valency: type.valency, bonded, remaining };
    });

    return { counts, allSatisfied, details };
  }, [atoms, bonds]);

  // Identify compound name by composition
  const compoundMatch = useMemo(() => {
    if (atoms.length === 0) return { name: 'Empty Canvas', formula: '', satisfied: false };
    
    // Count elements
    const counts = { C: 0, H: 0, O: 0, N: 0 };
    atoms.forEach(a => {
      if (counts[a.element] !== undefined) counts[a.element]++;
    });

    const isSatisfied = bondingStats.allSatisfied;
    
    // Fallback formula parser
    const formulaParts = [];
    if (counts.C > 0) formulaParts.push(`C${counts.C > 1 ? counts.C : ''}`);
    if (counts.H > 0) formulaParts.push(`H${counts.H > 1 ? counts.H : ''}`);
    if (counts.N > 0) formulaParts.push(`N${counts.N > 1 ? counts.N : ''}`);
    if (counts.O > 0) formulaParts.push(`O${counts.O > 1 ? counts.O : ''}`);
    const empiricalFormula = formulaParts.join('');

    if (!isSatisfied) {
      return { name: 'Incomplete valency structures...', formula: empiricalFormula, satisfied: false };
    }

    // Match patterns
    const C = counts.C;
    const H = counts.H;
    const O = counts.O;
    const N = counts.N;

    if (C === 1 && H === 4) return { name: 'Methane (Natural Gas)', formula: 'CH₄', satisfied: true };
    if (C === 1 && O === 2) return { name: 'Carbon Dioxide', formula: 'CO₂', satisfied: true };
    if (H === 2 && O === 1) return { name: 'Water', formula: 'H₂O', satisfied: true };
    if (C === 1 && H === 2 && O === 1) return { name: 'Formaldehyde', formula: 'CH₂O', satisfied: true };
    if (N === 1 && H === 3) return { name: 'Ammonia', formula: 'NH₃', satisfied: true };
    if (C === 2 && H === 6) return { name: 'Ethane', formula: 'C₂H₆', satisfied: true };
    if (C === 2 && H === 4) return { name: 'Ethene (Ethylene)', formula: 'C₂H₄', satisfied: true };
    if (C === 2 && H === 2) return { name: 'Ethyne (Acetylene)', formula: 'C₂H₂', satisfied: true };
    if (C === 2 && H === 6 && O === 1) return { name: 'Ethanol (Ethyl Alcohol)', formula: 'C₂H₅OH', satisfied: true };

    return { name: 'Custom Covalent Compound', formula: empiricalFormula, satisfied: true };
  }, [atoms, bondingStats]);

  // Load template helper
  const loadTemplate = (temp) => {
    setSelectedAtomId(null);
    setAtoms(temp.atoms.map(a => ({ ...a })));
    setBonds(temp.bonds.map(b => ({ ...b })));
    // adjust nextIdRef
    const maxId = Math.max(...temp.atoms.map(a => a.id), 0);
    nextIdRef.current = maxId + 1;
  };

  const addAtom = (element) => {
    const id = nextIdRef.current++;
    const newAtom = {
      id,
      element,
      x: 100 + Math.random() * 100,
      y: 80 + Math.random() * 80
    };
    setAtoms(prev => [...prev, newAtom]);
  };

  const clearCanvas = () => {
    setAtoms([]);
    setBonds([]);
    setSelectedAtomId(null);
    nextIdRef.current = 1;
  };

  // Atom interaction (select or bond)
  const handleAtomClick = (e, id) => {
    e.stopPropagation();
    if (draggingAtomId) return; // ignore click if dragged

    if (selectedAtomId === null) {
      setSelectedAtomId(id);
    } else if (selectedAtomId === id) {
      setSelectedAtomId(null);
    } else {
      // Toggle / cycle bond between selectedAtomId and id
      const a1 = Math.min(selectedAtomId, id);
      const a2 = Math.max(selectedAtomId, id);

      setBonds(prev => {
        const existingIdx = prev.findIndex(b => b.atom1Id === a1 && b.atom2Id === a2);
        if (existingIdx === -1) {
          // Add single bond
          return [...prev, { atom1Id: a1, atom2Id: a2, order: 1 }];
        } else {
          const currentOrder = prev[existingIdx].order;
          if (currentOrder < 3) {
            // cycle up to double / triple
            const updated = [...prev];
            updated[existingIdx] = { ...updated[existingIdx], order: currentOrder + 1 };
            return updated;
          } else {
            // remove bond
            return prev.filter((_, i) => i !== existingIdx);
          }
        }
      });

      setSelectedAtomId(null);
    }
  };

  // Drag handlers
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggingAtomId(id);
    const atom = atoms.find(a => a.id === id);
    if (!atom) return;

    // Calculate mouse offsets
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    dragOffsetRef.current = { x: mouseX - atom.x, y: mouseY - atom.y };
  };

  const handleMouseMove = (e) => {
    if (draggingAtomId === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setAtoms(prev => prev.map(a => {
      if (a.id === draggingAtomId) {
        // limit inside boundaries (300 x 240)
        const nx = Math.max(15, Math.min(285, mouseX - dragOffsetRef.current.x));
        const ny = Math.max(15, Math.min(225, mouseY - dragOffsetRef.current.y));
        return { ...a, x: nx, y: ny };
      }
      return a;
    }));
  };

  const handleMouseUp = () => {
    setDraggingAtomId(null);
  };

  return (
    <div className="molecule-builder-container" style={{
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
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>Organic Molecule Covalent Builder</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Build simple organic elements, bond valence shells, and check empirical molecular formulas.
          </p>
        </div>

        {/* Templates selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Load Templates:</span>
          {TEMPLATES.map(temp => (
            <button
              key={temp.name}
              onClick={() => loadTemplate(temp)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              className={`template-btn-${temp.formula}`}
            >
              {temp.formula}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'start'
      }} className="builder-dashboard-layout">

        {/* Left Side: SVG drag-and-drop workspace */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Action Builder Tools */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.keys(ATOM_TYPES).map(el => {
              const details = ATOM_TYPES[el];
              return (
                <button
                  key={el}
                  onClick={() => addAtom(el)}
                  style={{
                    background: details.color,
                    color: details.textColor,
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                  className={`add-atom-btn-${el}`}
                >
                  + {details.name}
                </button>
              );
            })}
            <button
              onClick={clearCanvas}
              style={{
                background: 'rgba(255, 71, 87, 0.2)',
                border: '1px solid #ff4757',
                color: '#ff4757',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              className="clear-canvas-btn"
            >
              Clear
            </button>
          </div>

          {/* SVG Workspace */}
          <svg
            ref={containerRef}
            viewBox="0 0 300 240"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Draw Bonds */}
            {bonds.map((b, idx) => {
              const a1 = atoms.find(a => a.id === b.atom1Id);
              const a2 = atoms.find(a => a.id === b.atom2Id);
              if (!a1 || !a2) return null;

              // double / triple offsets calculations
              const dx = a2.x - a1.x;
              const dy = a2.y - a1.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const ux = -dy / len;
              const uy = dx / len;

              return (
                <g key={idx}>
                  {b.order === 1 && (
                    <line x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="#fff" strokeWidth="3" opacity="0.8" />
                  )}
                  {b.order === 2 && (
                    <>
                      <line x1={a1.x + ux * 3} y1={a1.y + uy * 3} x2={a2.x + ux * 3} y2={a2.y + uy * 3} stroke="#fff" strokeWidth="2.5" opacity="0.8" />
                      <line x1={a1.x - ux * 3} y1={a1.y - uy * 3} x2={a2.x - ux * 3} y2={a2.y - uy * 3} stroke="#fff" strokeWidth="2.5" opacity="0.8" />
                    </>
                  )}
                  {b.order === 3 && (
                    <>
                      <line x1={a1.x + ux * 5} y1={a1.y + uy * 5} x2={a2.x + ux * 5} y2={a2.y + uy * 5} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <line x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <line x1={a1.x - ux * 5} y1={a1.y - uy * 5} x2={a2.x - ux * 5} y2={a2.y - uy * 5} stroke="#fff" strokeWidth="2" opacity="0.8" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Draw Atoms */}
            {atoms.map((a) => {
              const details = ATOM_TYPES[a.element];
              const stats = bondingStats.details.find(d => d.id === a.id);
              const isSelected = selectedAtomId === a.id;
              const isFullySatisfied = stats && stats.remaining === 0;

              return (
                <g
                  key={a.id}
                  transform={`translate(${a.x}, ${a.y})`}
                  onMouseDown={(e) => handleMouseDown(e, a.id)}
                  onClick={(e) => handleAtomClick(e, a.id)}
                  style={{ cursor: 'grab' }}
                  className="draggable-atom-node"
                >
                  {/* Satisfaction outer ring */}
                  <circle
                    r={details.radius + 6}
                    fill="none"
                    stroke={isFullySatisfied ? '#2ed573' : 'rgba(255, 255, 255, 0.08)'}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    style={{ transition: 'stroke 0.2s ease' }}
                  />

                  {/* Core element circle */}
                  <circle
                    r={details.radius}
                    fill={details.color}
                    stroke={isSelected ? '#00f2fe' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isSelected ? '3' : '1'}
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px #00f2fe)' : 'none' }}
                  />

                  {/* Element label */}
                  <text
                    y="4"
                    fill={details.textColor}
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {a.element}
                  </text>

                  {/* Valence counts indicator dot */}
                  {stats && !isFullySatisfied && (
                    <text
                      y={-details.radius - 8}
                      fill="#eccc68"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {stats.remaining}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Side: Identified parameters info */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          color: '#fff',
          boxSizing: 'border-box'
        }} className="builder-info-card">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#00f2fe' }}>Molecular Parameters</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Structure Name</span>
              <strong style={{ fontSize: '1.1rem' }} className="compound-name-output">{compoundMatch.name}</strong>
            </div>

            <div>
              <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Chemical Formula</span>
              <strong style={{ fontSize: '1.4rem', color: '#00f2fe' }} className="compound-formula-output">{compoundMatch.formula || 'N/A'}</strong>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />

            {/* Instruction / Help Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.75rem',
              lineHeight: '1.4',
              opacity: 0.85
            }}>
              <strong style={{ display: 'block', marginBottom: '4px', color: '#eccc68' }}>How to Bond:</strong>
              1. Click an atom to select it (glows blue).<br />
              2. Click a second atom to create/cycle a covalent bond (Single ➔ Double ➔ Triple ➔ None).<br />
              3. Drag atoms to clean up the topology.<br />
              4. Fully satisfy the valence outer rings (rings turn green) to complete your compound.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
