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
    desc: 'Synthesis of water. Highly exothermic reaction!'
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
    desc: 'Combustion of methane gas (natural gas).'
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
    desc: 'Oxidation of iron (commonly known as rusting).'
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
    desc: 'The Haber-Bosch process for industrial synthesis of ammonia.'
  }
];

export function EquationBalancer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [coefficients, setCoefficients] = useState([1, 1, 1]);
  const [isBalanced, setIsBalanced] = useState(false);

  const reaction = REACTIONS[currentIdx];

  useEffect(() => {
    // Reset coefficients to 1s on reaction change
    const initialCoeffs = Array(reaction.reactants.length + reaction.products.length).fill(1);
    setCoefficients(initialCoeffs);
    setIsBalanced(false);
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
        
        {/* Interaction Workspace */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: '#fff', margin: '20px 0' }}>
          
          {/* Reactants */}
          {reaction.reactants.map((react, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button onClick={() => handleCoefficientChange(i, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▲</button>
                  <button onClick={() => handleCoefficientChange(i, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>▼</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#00f2fe' }}>{coefficients[i]}</strong>
                  <span>{react.text}</span>
                </div>
              </div>
              {i < reaction.reactants.length - 1 && <span style={{ padding: '0 8px' }}>+</span>}
            </React.Fragment>
          ))}

          <span style={{ padding: '0 12px', color: '#ff4757' }}>→</span>

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
                    <strong style={{ color: '#00f2fe' }}>{coefficients[index]}</strong>
                    <span>{prod.text}</span>
                  </div>
                </div>
                {i < reaction.products.length - 1 && <span style={{ padding: '0 8px' }}>+</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Element Tallies */}
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', opacity: 0.8, textAlign: 'center' }}>Conservation of Mass Tally</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {elementsInvolved.map(el => {
              const rCount = reactantsTally[el] || 0;
              const pCount = productsTally[el] || 0;
              const isMatch = rCount === pCount;

              return (
                <div key={el} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', border: `1px solid ${isMatch ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)'}` }}>
                  <span style={{ fontWeight: 'bold' }}>{el} atoms</span>
                  <span style={{ color: isMatch ? '#2ed573' : '#ff4757' }}>
                    Reactants: <strong>{rCount}</strong> vs Products: <strong>{pCount}</strong>
                  </span>
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
