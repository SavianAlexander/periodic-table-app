import React, { useState, useEffect } from 'react';
import elements from '../data/elements.json';

// Subshell definitions: name, orbital boxes count, energy order rating, shell electrons capacity
const SUBSHELLS = [
  { name: '1s', count: 1, energy: 1, limit: 2 },
  { name: '2s', count: 1, energy: 2, limit: 2 },
  { name: '2p', count: 3, energy: 3, limit: 6 },
  { name: '3s', count: 1, energy: 4, limit: 2 },
  { name: '3p', count: 3, energy: 5, limit: 6 },
  { name: '4s', count: 1, energy: 6, limit: 2 },
  { name: '3d', count: 5, energy: 7, limit: 10 }
];

export function AufbauSandbox({ selectedElement, onElementChange }) {
  const [activeElement, setActiveElement] = useState(elements[0]); // default Hydrogen
  const [electrons, setElectrons] = useState({}); // key: subshell-boxIdx, val: Array of spins ['up', 'down']
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (selectedElement) {
      setActiveElement(selectedElement);
    }
  }, [selectedElement]);

  useEffect(() => {
    autoFillElectrons(activeElement);
  }, [activeElement]);

  const autoFillElectrons = (el) => {
    const totalElectrons = el.atomicNumber;
    let remaining = totalElectrons;
    const nextElectrons = {};

    // Initialize empty arrays
    SUBSHELLS.forEach(sub => {
      for (let i = 0; i < sub.count; i++) {
        nextElectrons[`${sub.name}-${i}`] = [];
      }
    });

    // Fill systematically according to Aufbau principle
    for (const sub of SUBSHELLS) {
      if (remaining <= 0) break;
      const fillAmount = Math.min(remaining, sub.limit);
      remaining -= fillAmount;

      // Fill subshell orbitals
      // Hund's rule: fill singly first
      for (let step = 0; step < fillAmount; step++) {
        if (step < sub.count) {
          // First pass: spin up
          nextElectrons[`${sub.name}-${step}`].push('up');
        } else {
          // Second pass: spin down
          nextElectrons[`${sub.name}-${step - sub.count}`].push('down');
        }
      }
    }

    setElectrons(nextElectrons);
    setFeedback(`Automatically filled configurations for ${el.name} (Atomic Number: ${el.atomicNumber}).`);
  };

  const handleBoxClick = (subshellName, boxIdx) => {
    const key = `${subshellName}-${boxIdx}`;
    const current = [...(electrons[key] || [])];
    
    // Toggle sequence: empty -> ['up'] -> ['up', 'down'] -> empty
    if (current.length === 0) {
      current.push('up');
    } else if (current.length === 1) {
      current.push('down');
    } else {
      current.length = 0;
    }

    const nextElectrons = { ...electrons, [key]: current };
    setElectrons(nextElectrons);
    verifyRules(nextElectrons);
  };

  const verifyRules = (states) => {
    let totalPlaced = 0;
    let hasPauliViolation = false;
    let hasHundViolation = false;

    SUBSHELLS.forEach(sub => {
      const subshellAtoms = [];
      for (let i = 0; i < sub.count; i++) {
        const key = `${sub.name}-${i}`;
        const boxElectrons = states[key] || [];
        totalPlaced += boxElectrons.length;

        // Pauli exclusion check
        if (boxElectrons.length > 2) {
          hasPauliViolation = true;
        }
        subshellAtoms.push(boxElectrons);
      }

      // Hund's rule check: in a subshell, verify no doubling up occurs before all have at least one electron
      const containsDoubles = subshellAtoms.some(box => box.length === 2);
      const containsEmpties = subshellAtoms.some(box => box.length === 0);
      if (containsDoubles && containsEmpties) {
        hasHundViolation = true;
      }
    });

    if (hasPauliViolation) {
      setFeedback('⚠️ Pauli Exclusion Principle Violation: An orbital box cannot hold more than 2 electrons.');
    } else if (hasHundViolation) {
      setFeedback("⚠️ Hund's Rule Violation: Fill all orbitals in a subshell singly (with parallel spins) first before pairing up.");
    } else {
      const match = totalPlaced === activeElement.atomicNumber;
      setFeedback(
        match 
          ? `🟢 Correct! Electron configuration matches ${activeElement.name} (${totalPlaced} e⁻).`
          : `Placed ${totalPlaced} electrons. Target for ${activeElement.name} is ${activeElement.atomicNumber} electrons.`
      );
    }
  };

  const handleReset = () => {
    const nextElectrons = {};
    SUBSHELLS.forEach(sub => {
      for (let i = 0; i < sub.count; i++) {
        nextElectrons[`${sub.name}-${i}`] = [];
      }
    });
    setElectrons(nextElectrons);
    setFeedback('Workspace cleared. Click boxes to manually place electrons.');
  };

  return (
    <div className="aufbau-sandbox" style={{
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Aufbau Electron Configuration Sandbox</h2>
        {!selectedElement && (
          <select
            value={elements.indexOf(activeElement)}
            onChange={(e) => setActiveElement(elements[e.target.value])}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem'
            }}
          >
            {elements.slice(0, 36).map((el, i) => (
              <option key={i} value={i}>{el.atomicNumber}. {el.name} ({el.symbol})</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
        {/* Subshell Energy Diagram */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '14px', margin: '20px 0' }}>
          {SUBSHELLS.map(sub => {
            const boxes = [];
            for (let idx = 0; idx < sub.count; idx++) {
              const key = `${sub.name}-${idx}`;
              const contents = electrons[key] || [];

              boxes.push(
                <div
                  key={idx}
                  onClick={() => handleBoxClick(sub.name, idx)}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    color: '#00f2fe',
                    userSelect: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#00f2fe'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  {contents.includes('up') && <span>↑</span>}
                  {contents.includes('down') && <span>↓</span>}
                </div>
              );
            }

            return (
              <div key={sub.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ minWidth: '40px', fontWeight: 'bold', color: '#ff4757', textAlign: 'right' }}>{sub.name}</div>
                <div style={{ display: 'flex', gap: '8px' }}>{boxes}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic' }}>{feedback}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                padding: '6px 14px',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <button
              onClick={() => autoFillElectrons(activeElement)}
              style={{
                background: '#00f2fe',
                border: 'none',
                color: '#12131c',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Auto-Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
