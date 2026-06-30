import React, { useState, useEffect } from 'react';

const REACTIONS = [
  {
    id: 1,
    equation: 'H₂ + O₂ → H₂O',
    reactants: [
      { text: 'H₂', multiplier: { H: 2 } },
      { text: 'O₂', multiplier: { O: 2 } }
    ],
    products: [
      { text: 'H₂O', multiplier: { H: 2, O: 1 } }
    ],
    correctCoeffs: [2, 1, 2],
    desc: 'Synthesis of water. Highly exothermic reaction!',
    tip: 'Oxygen is diatomic on the left but single in water. Try placing a 2 in front of H₂O to balance Oxygen first, then adjust H₂.'
  },
  {
    id: 2,
    equation: 'CH₄ + O₂ → CO₂ + H₂O',
    reactants: [
      { text: 'CH₄', multiplier: { C: 1, H: 4 } },
      { text: 'O₂', multiplier: { O: 2 } }
    ],
    products: [
      { text: 'CO₂', multiplier: { C: 1, O: 2 } },
      { text: 'H₂O', multiplier: { H: 2, O: 1 } }
    ],
    correctCoeffs: [1, 2, 1, 2],
    desc: 'Combustion of methane gas (natural gas).',
    tip: 'Always balance Carbon first, then Hydrogen. Save Oxygen (which appears as a pure element O₂) for last.'
  },
  {
    id: 3,
    equation: 'Fe + O₂ → Fe₂O₃',
    reactants: [
      { text: 'Fe', multiplier: { Fe: 1 } },
      { text: 'O₂', multiplier: { O: 2 } }
    ],
    products: [
      { text: 'Fe₂O₃', multiplier: { Fe: 2, O: 3 } }
    ],
    correctCoeffs: [4, 3, 2],
    desc: 'Oxidation of iron (commonly known as rusting).',
    tip: 'Oxygen has 2 atoms on the reactant side and 3 on the product side. Find their least common multiple (6) to balance Oxygen first.'
  },
  {
    id: 4,
    equation: 'N₂ + H₂ → NH₃',
    reactants: [
      { text: 'N₂', multiplier: { N: 2 } },
      { text: 'H₂', multiplier: { H: 2 } }
    ],
    products: [
      { text: 'NH₃', multiplier: { N: 1, H: 3 } }
    ],
    correctCoeffs: [1, 3, 2],
    desc: 'The Haber-Bosch process for industrial synthesis of ammonia.',
    tip: 'Nitrogen is diatomic on the reactants side. Start by placing a 2 in front of NH₃, then calculate the Hydrogen needed.'
  }
];

export function EquationBalancer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [coefficients, setCoefficients] = useState([1, 1, 1]);
  const [isBalanced, setIsBalanced] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const reaction = REACTIONS[currentIdx];

  useEffect(() => {
    // Reset coefficients to 1s on reaction change
    const initialCoeffs = Array(reaction.reactants.length + reaction.products.length).fill(1);
    setCoefficients(initialCoeffs);
    setIsBalanced(false);
    setShowTip(false);
  }, [currentIdx]);

  // Compute element tallies on both sides
  const getTallies = () => {
    const reactantsTally = {};
    const productsTally = {};

    // Calculate Reactants
    reaction.reactants.forEach((r, i) => {
      const coeff = coefficients[i] || 1;
      Object.keys(r.multiplier).forEach(el => {
        reactantsTally[el] = (reactantsTally[el] || 0) + r.multiplier[el] * coeff;
      });
    });

    // Calculate Products
    reaction.products.forEach((p, i) => {
      const coeff = coefficients[reaction.reactants.length + i] || 1;
      Object.keys(p.multiplier).forEach(el => {
        productsTally[el] = (productsTally[el] || 0) + p.multiplier[el] * coeff;
      });
    });

    return { reactantsTally, productsTally };
  };

  const { reactantsTally, productsTally } = getTallies();
  const elementsInvolved = Object.keys({ ...reactantsTally, ...productsTally });

  const handleCoefficientChange = (idx, delta) => {
    const next = [...coefficients];
    next[idx] = Math.max(1, Math.min(9, next[idx] + delta));
    setCoefficients(next);

    // Verify balance
    let match = true;
    next.forEach((val, i) => {
      if (val !== reaction.correctCoeffs[i]) {
        match = false;
      }
    });
    setIsBalanced(match);
  };

  return (
    <div className="equation-balancer-container" style={{
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
        <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Chemical Equation Balancing Game</h2>
        <select
          value={currentIdx}
          onChange={(e) => setCurrentIdx(parseInt(e.target.value, 10))}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.85rem'
          }}
        >
          {REACTIONS.map((r, i) => <option key={i} value={i}>Reaction {r.id}: {r.equation}</option>)}
        </select>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>{reaction.desc}</p>
        
        <button
          onClick={() => setShowTip(!showTip)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#00f2fe',
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {showTip ? 'Hide Balancing Tip' : 'Show Balancing Tip'}
        </button>

        {showTip && (
          <div style={{
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            color: '#00f2fe',
            maxWidth: '500px',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            💡 {reaction.tip}
          </div>
        )}
        
        {/* Interaction Workspace */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          color: '#fff',
          margin: '10px 0',
          padding: '16px 24px',
          borderRadius: '12px',
          border: isBalanced ? '2px solid #2ed573' : '2px dashed rgba(255,255,255,0.05)',
          background: isBalanced ? 'rgba(46, 213, 115, 0.05)' : 'transparent',
          boxShadow: isBalanced ? '0 0 25px rgba(46, 213, 115, 0.3)' : 'none',
          transform: isBalanced ? 'scale(1.03)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          
          {/* Reactants */}
          {reaction.reactants.map((react, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button onClick={() => handleCoefficientChange(i, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▲</button>
                  <button onClick={() => handleCoefficientChange(i, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▼</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: isBalanced ? '#2ed573' : '#00f2fe' }}>{coefficients[i]}</strong>
                  <span>{react.text}</span>
                </div>
              </div>
              {i < reaction.reactants.length - 1 && <span style={{ padding: '0 8px' }}>+</span>}
            </React.Fragment>
          ))}

          <span style={{ padding: '0 12px', color: isBalanced ? '#2ed573' : '#ff4757' }}>→</span>

          {/* Products */}
          {reaction.products.map((prod, i) => {
            const index = reaction.reactants.length + i;
            return (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button onClick={() => handleCoefficientChange(index, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▲</button>
                    <button onClick={() => handleCoefficientChange(index, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▼</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: isBalanced ? '#2ed573' : '#00f2fe' }}>{coefficients[index]}</strong>
                    <span>{prod.text}</span>
                  </div>
                </div>
                {i < reaction.products.length - 1 && <span style={{ padding: '0 8px' }}>+</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Element Tallies */}
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', opacity: 0.8, textAlign: 'center' }}>Conservation of Mass Tally</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {elementsInvolved.map(el => {
              const rCount = reactantsTally[el] || 0;
              const pCount = productsTally[el] || 0;
              const isMatch = rCount === pCount;
              const tiltAngle = rCount === pCount ? 0 : rCount > pCount ? -12 : 12;
              const scaleColor = isMatch ? '#2ed573' : '#ff4757';

              return (
                <div key={el} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isMatch ? 'rgba(46, 213, 115, 0.25)' : 'rgba(255, 71, 87, 0.25)'}`, gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{el} Atoms</span>
                    <span style={{ fontSize: '0.8rem', color: isMatch ? '#2ed573' : '#ff4757', marginTop: '2px' }}>
                      Reactants: <strong>{rCount}</strong> vs Products: <strong>{pCount}</strong>
                    </span>
                  </div>
                  
                  {/* Visual SVG Balance Scale */}
                  <svg width="60" height="40" viewBox="0 0 60 40" style={{ overflow: 'visible' }}>
                    <path d="M 30 20 L 30 35 M 20 35 L 40 35" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="30,17 26,22 34,22" fill={scaleColor} />
                    
                    <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: '30px 20px', transition: 'transform 0.4s ease' }}>
                      <line x1="12" y1="20" x2="48" y2="20" stroke={scaleColor} strokeWidth="3" strokeLinecap="round" />
                      
                      <line x1="15" y1="20" x2="15" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                      <ellipse cx="15" cy="28" rx="7" ry="2" fill="rgba(0,0,0,0.4)" stroke={scaleColor} strokeWidth="1.5" />
                      
                      <line x1="45" y1="20" x2="45" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                      <ellipse cx="45" cy="28" rx="7" ry="2" fill="rgba(0,0,0,0.4)" stroke={scaleColor} strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>

        {isBalanced && (
          <div style={{
            background: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            color: '#2ed573',
            borderRadius: '8px',
            padding: '12px 24px',
            marginTop: '10px',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            maxWidth: '400px'
          }}>
            🎉 Equation Balanced! Conservation of Mass achieved!
          </div>
        )}
      </div>
    </div>
  );
}
