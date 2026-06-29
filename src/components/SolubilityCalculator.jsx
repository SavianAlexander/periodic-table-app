import React, { useState } from 'react';

const CATIONS = [
  { name: 'Sodium', symbol: 'Na⁺' },
  { name: 'Potassium', symbol: 'K⁺' },
  { name: 'Ammonium', symbol: 'NH₄⁺' },
  { name: 'Calcium', symbol: 'Ca²⁺' },
  { name: 'Barium', symbol: 'Ba²⁺' },
  { name: 'Silver', symbol: 'Ag⁺' },
  { name: 'Lead', symbol: 'Pb²⁺' }
];

const ANIONS = [
  { name: 'Nitrate', symbol: 'NO₃⁻' },
  { name: 'Chloride', symbol: 'Cl⁻' },
  { name: 'Sulfate', symbol: 'SO₄²⁻' },
  { name: 'Carbonate', symbol: 'CO₃²⁻' },
  { name: 'Hydroxide', symbol: 'OH⁻' }
];

// Helper to determine solubility & formula
const getSolubility = (cation, anion) => {
  const cat = cation.symbol;
  const ani = anion.symbol;

  // 1. Nitrates are always soluble
  if (ani === 'NO₃⁻') return { soluble: true, formula: `${cat.replace('⁺','').replace('²⁺','')}(NO₃)${cat.includes('²') ? '₂' : ''}`, rule: 'Rule: All nitrates (NO₃⁻) are soluble.' };
  
  // 2. Sodium, Potassium, Ammonium are always soluble
  if (['Na⁺', 'K⁺', 'NH₄⁺'].includes(cat)) {
    let sub = '';
    if (ani.includes('²')) sub = '₂';
    return { soluble: true, formula: `(${cat.replace('⁺','').replace('²⁺','')})${sub}${ani.replace('⁻','').replace('²⁻','')}`, rule: `Rule: All salts of alkali metals (Na⁺, K⁺) and ammonium (NH₄⁺) are soluble.` };
  }

  // 3. Chlorides exception (Ag, Pb)
  if (ani === 'Cl⁻') {
    if (['Ag⁺', 'Pb²⁺'].includes(cat)) {
      const sub = cat === 'Pb²⁺' ? '₂' : '';
      return { soluble: false, formula: `${cat.replace('⁺','').replace('²⁺','')}Cl${sub}`, rule: 'Rule: Most chlorides (Cl⁻) are soluble, except Silver (Ag⁺) and Lead (Pb²⁺).' };
    }
    const sub = cat.includes('²') ? '₂' : '';
    return { soluble: true, formula: `${cat.replace('⁺','').replace('²⁺','')}Cl${sub}`, rule: 'Rule: Chlorides are generally soluble.' };
  }

  // 4. Sulfates exception (Ca, Ba, Pb)
  if (ani === 'SO₄²⁻') {
    if (['Ca²⁺', 'Ba²⁺', 'Pb²⁺'].includes(cat)) {
      return { soluble: false, formula: `${cat.replace('⁺','').replace('²⁺','')}SO₄`, rule: 'Rule: Sulfates (SO₄²⁻) are soluble except with Calcium (Ca²⁺), Barium (Ba²⁺), and Lead (Pb²⁺).' };
    }
    let subCat = cat.includes('²') ? '' : '₂';
    return { soluble: true, formula: `${cat.replace('⁺','').replace('²⁺','')}${subCat}SO₄`, rule: 'Rule: Sulfates are generally soluble.' };
  }

  // 5. Carbonates and Hydroxides are generally insoluble (except rule 2)
  if (ani === 'CO₃²⁻') {
    return { soluble: false, formula: `${cat.replace('⁺','').replace('²⁺','')}CO₃`, rule: 'Rule: Carbonates (CO₃²⁻) are generally insoluble.' };
  }

  if (ani === 'OH⁻') {
    const sub = cat.includes('²') ? '₂' : '';
    return { soluble: false, formula: `${cat.replace('⁺','').replace('²⁺','')}(OH)${sub}`, rule: 'Rule: Hydroxides (OH⁻) are generally insoluble.' };
  }

  return { soluble: true, formula: 'Compound', rule: 'General Solubility rules applied.' };
};

export function SolubilityCalculator() {
  const [selectedCation, setSelectedCation] = useState(CATIONS[0]);
  const [selectedAnion, setSelectedAnion] = useState(ANIONS[1]); // Nitrate default

  const result = getSolubility(selectedCation, selectedAnion);

  return (
    <div className="solubility-calculator-container" style={{
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
      <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Solubility Matrix Calculator</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Dropdown selectors */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8, marginBottom: '6px' }}>Select Cation (+):</label>
            <select
              value={CATIONS.indexOf(selectedCation)}
              onChange={(e) => setSelectedCation(CATIONS[e.target.value])}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.9rem'
              }}
            >
              {CATIONS.map((c, i) => <option key={i} value={i}>{c.name} ({c.symbol})</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8, marginBottom: '6px' }}>Select Anion (-):</label>
            <select
              value={ANIONS.indexOf(selectedAnion)}
              onChange={(e) => setSelectedAnion(ANIONS[e.target.value])}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.9rem'
              }}
            >
              {ANIONS.map((a, i) => <option key={i} value={i}>{a.name} ({a.symbol})</option>)}
            </select>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.9rem',
            lineHeight: 1.4
          }}>
            <div style={{ fontWeight: 'bold', color: '#00f2fe', marginBottom: '4px' }}>Reaction Equation:</div>
            <div style={{ fontFamily: 'monospace' }}>
              {`${selectedCation.symbol} + ${selectedAnion.symbol} → `}
              <strong style={{ color: result.soluble ? '#2ed573' : '#ff4757' }}>
                {result.formula} {result.soluble ? '(aq)' : '(s) ↓'}
              </strong>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.7 }}>
              {result.rule}
            </div>
          </div>
        </div>

        {/* Visual Tube Output */}
        <div style={{ flex: '1 1 250px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8 }}>Precipitation Visualizer</h3>
          
          <svg width="80" height="200" viewBox="0 0 80 200" style={{ overflow: 'visible' }}>
            {/* Liquid Level */}
            <path
              d="M 15 80 Q 40 78 65 80 L 65 180 Q 40 185 15 180 Z"
              fill={result.soluble ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 255, 255, 0.15)'}
              style={{ transition: 'fill 0.3s ease' }}
            />

            {/* Insoluble Solid Precipitate at Bottom */}
            {!result.soluble && (
              <path
                d="M 15 170 Q 40 172 65 170 L 65 180 Q 40 185 15 180 Z"
                fill="#ffffff"
                style={{
                  filter: 'drop-shadow(0 0 4px #ffffff)',
                  animation: 'settleDown 1.5s ease-out'
                }}
              />
            )}

            {/* Test Tube Outline */}
            <path
              d="M 15 30 L 15 180 A 25 25 0 0 0 65 180 L 65 30"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Tube lip */}
            <ellipse cx="40" cy="30" rx="27" ry="6" fill="rgba(0,0,0,0.3)" stroke="#ffffff" strokeWidth="3" />
          </svg>

          <div style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: result.soluble ? '#2ed573' : '#ff4757'
          }}>
            {result.soluble ? '🟢 Soluble (No Precipitate)' : '🔴 Insoluble (Precipitate Forms)'}
          </div>
        </div>

      </div>
    </div>
  );
}
