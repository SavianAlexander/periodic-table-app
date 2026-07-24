import React, { useState, useMemo } from 'react';
import elements from '../data/elements.json';

const PROPERTIES = [
  { name: 'Atomic Number', key: 'atomicNumber', unit: '' },
  { name: 'Atomic Mass (u)', key: 'atomicMass', unit: 'u' },
  { name: 'Electronegativity', key: 'electronegativity', unit: '' },
  { name: 'Ionization Energy (kJ/mol)', key: 'ionizationEnergy', unit: ' kJ/mol' },
  { name: 'Melting Point (K)', key: 'meltingPoint', unit: ' K' },
  { name: 'Boiling Point (K)', key: 'boilingPoint', unit: ' K' },
  { name: 'Density', key: 'density', unit: '' }
];

export function ComparisonGraph() {
  const [propX, setPropX] = useState(PROPERTIES[0]); // Default X: Atomic Number
  const [propY, setPropY] = useState(PROPERTIES[2]); // Default Y: Electronegativity
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Filter elements with valid numeric properties for the selected X and Y keys
  const validElements = useMemo(() => {
    return elements.filter(el => {
      const valX = el[propX.key];
      const valY = el[propY.key];
      
      // Group filter
      if (selectedGroup !== 'All' && el.groupBlock?.toLowerCase().replace(/\s+/g, '-') !== selectedGroup) {
        return false;
      }

      return typeof valX === 'number' && typeof valY === 'number';
    });
  }, [propX.key, propY.key, selectedGroup]);

  // Calculate scales and mins/maxes
  const { boundMinX, boundMaxX, boundMinY, boundMaxY } = useMemo(() => {
    const valuesX = validElements.map(el => el[propX.key]);
    const valuesY = validElements.map(el => el[propY.key]);

    const minX = valuesX.length > 0 ? Math.min(...valuesX) : 0;
    const maxX = valuesX.length > 0 ? Math.max(...valuesX) : 100;
    const minY = valuesY.length > 0 ? Math.min(...valuesY) : 0;
    const maxY = valuesY.length > 0 ? Math.max(...valuesY) : 100;

    // Add padding to chart bounds
    const paddingPct = 0.1;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    return {
      boundMinX: minX - rangeX * paddingPct,
      boundMaxX: maxX + rangeX * paddingPct,
      boundMinY: minY - rangeY * paddingPct,
      boundMaxY: maxY + rangeY * paddingPct
    };
  }, [validElements, propX.key, propY.key]);

  // Dimensions of SVG viewBox
  const width = 500;
  const height = 300;
  const chartPadLeft = 45;
  const chartPadRight = 15;
  const chartPadTop = 15;
  const chartPadBottom = 35;
  const chartWidth = width - chartPadLeft - chartPadRight;
  const chartHeight = height - chartPadTop - chartPadBottom;

  const getCanvasX = (val) => {
    return chartPadLeft + ((val - boundMinX) / (boundMaxX - boundMinX)) * chartWidth;
  };

  const getCanvasY = (val) => {
    return chartPadTop + chartHeight - ((val - boundMinY) / (boundMaxY - boundMinY)) * chartHeight;
  };

  const groupBlocks = Array.from(new Set(elements.map(el => el.groupBlock).filter(Boolean)));

  const correlation = useMemo(() => {
    if (validElements.length < 2) return null;
    const n = validElements.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    validElements.forEach(el => {
      const x = el[propX.key];
      const y = el[propY.key];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    });
    
    const num = (n * sumXY) - (sumX * sumY);
    const den = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
    if (den === 0) return 0;
    return num / den;
  }, [validElements, propX.key, propY.key]);
  const getCorrelationStrength = (r) => {
    if (r === null) return 'N/A';
    const abs = Math.abs(r);
    let strength = '';
    if (abs >= 0.7) strength = 'Strong';
    else if (abs >= 0.3) strength = 'Moderate';
    else strength = 'Weak/None';
    return `${strength} ${r > 0 ? 'Positive' : 'Negative'} Correlation`;
  };

  return (
    <div className="comparison-graph-container" style={{
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
      boxSizing: 'border-box'
    }}>
      {/* Header and selector controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Multi-Dimensional Property Analyzer</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          
          <label style={{ fontSize: '0.85rem', opacity: 0.8 }}>X-Axis:</label>
          <select 
            value={PROPERTIES.indexOf(propX)} 
            onChange={(e) => setPropX(PROPERTIES[e.target.value])}
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '4px 10px', fontSize: '0.85rem' }}
          >
            {PROPERTIES.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
          </select>

          <label style={{ fontSize: '0.85rem', opacity: 0.8, marginLeft: '8px' }}>Y-Axis:</label>
          <select 
            value={PROPERTIES.indexOf(propY)} 
            onChange={(e) => setPropY(PROPERTIES[e.target.value])}
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '4px 10px', fontSize: '0.85rem' }}
          >
            {PROPERTIES.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
          </select>

          <label style={{ fontSize: '0.85rem', opacity: 0.8, marginLeft: '8px' }}>Group:</label>
          <select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '4px 10px', fontSize: '0.85rem' }}
          >
            <option value="All">All Groups</option>
            {groupBlocks.map((g, i) => (
              <option key={i} value={g.toLowerCase().replace(/\s+/g, '-')}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {correlation !== null && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <span style={{ opacity: 0.8 }}>Pearson Correlation Coefficient (r):</span>{' '}
            <strong style={{ color: '#00f2fe', fontFamily: 'monospace' }}>{correlation.toFixed(3)}</strong>
          </div>
          <div style={{
            background: Math.abs(correlation) >= 0.7 ? 'rgba(46, 213, 115, 0.15)' : Math.abs(correlation) >= 0.3 ? 'rgba(255, 165, 2, 0.15)' : 'rgba(255, 71, 87, 0.15)',
            border: `1px solid ${Math.abs(correlation) >= 0.7 ? '#2ed573' : Math.abs(correlation) >= 0.3 ? '#ffa502' : '#ff4757'}`,
            color: Math.abs(correlation) >= 0.7 ? '#2ed573' : Math.abs(correlation) >= 0.3 ? '#ffa502' : '#ff4757',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {getCorrelationStrength(correlation)}
          </div>
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Render interactive SVG graph */}
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'visible' }}>
          {/* Grid lines & Axes */}
          <line x1={chartPadLeft} y1={chartPadTop} x2={chartPadLeft} y2={chartPadTop + chartHeight} stroke="rgba(255,255,255,0.2)" />
          <line x1={chartPadLeft} y1={chartPadTop + chartHeight} x2={width - chartPadRight} y2={chartPadTop + chartHeight} stroke="rgba(255,255,255,0.2)" />

          {/* Grid vertical / horizontal lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const pct = i / 4;
            const x = chartPadLeft + pct * chartWidth;
            const y = chartPadTop + pct * chartHeight;
            const valX = boundMinX + pct * (boundMaxX - boundMinX);
            const valY = boundMaxY - pct * (boundMaxY - boundMinY);

            return (
              <g key={i}>
                {/* Vertical tick & gridline */}
                <line x1={x} y1={chartPadTop} x2={x} y2={chartPadTop + chartHeight} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                <text x={x} y={chartPadTop + chartHeight + 15} fill="rgba(255,255,255,0.5)" textAnchor="middle" style={{ fontSize: '8px' }}>{valX.toFixed(1)}</text>

                {/* Horizontal tick & gridline */}
                <line x1={chartPadLeft} y1={y} x2={width - chartPadRight} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                <text x={chartPadLeft - 8} y={y + 3} fill="rgba(255,255,255,0.5)" textAnchor="end" style={{ fontSize: '8px' }}>{valY.toFixed(1)}</text>
              </g>
            );
          })}

          {/* Axes Titles */}
          <text x={chartPadLeft + chartWidth / 2} y={height - 5} fill="rgba(255,255,255,0.7)" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 600 }}>{propX.name}</text>
          <text x={10} y={chartPadTop + chartHeight / 2} fill="rgba(255,255,255,0.7)" textAnchor="middle" transform={`rotate(-90 10 ${chartPadTop + chartHeight / 2})`} style={{ fontSize: '10px', fontWeight: 600 }}>{propY.name}</text>

          {/* Plot Data Points */}
          {validElements.map((el) => {
            const x = getCanvasX(el[propX.key]);
            const y = getCanvasY(el[propY.key]);
            const isHovered = hoveredPoint === el.atomicNumber;

            return (
              <g key={el.atomicNumber}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 4}
                  fill={isHovered ? '#ff4757' : '#00f2fe'}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                  onMouseEnter={() => setHoveredPoint(el.atomicNumber)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{
                    cursor: 'pointer',
                    transition: 'r 0.15s ease, fill 0.15s ease',
                    filter: isHovered ? 'drop-shadow(0 0 4px #ff4757)' : 'drop-shadow(0 0 2px #00f2fe)'
                  }}
                />
                {/* Element Symbol label inside/near point */}
                <text
                  x={x}
                  y={y - 8}
                  fill="#ffffff"
                  textAnchor="middle"
                  style={{
                    fontSize: isHovered ? '9px' : '6px',
                    fontWeight: isHovered ? 'bold' : 'normal',
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0.4
                  }}
                >
                  {el.symbol}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover details display card */}
        {hoveredPoint && (
          (() => {
            const el = elements.find(item => item.atomicNumber === hoveredPoint);
            if (!el) return null;
            return (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(20, 22, 35, 0.9)',
                border: '1px solid #00f2fe',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
                animation: 'slideIn 0.2s ease'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{el.name} ({el.symbol})</div>
                <div style={{ opacity: 0.7, margin: '2px 0 6px 0', fontSize: '0.75rem' }}>{el.groupBlock}</div>
                <div>{propX.name}: <strong>{el[propX.key]}{propX.unit}</strong></div>
                <div>{propY.name}: <strong>{el[propY.key]}{propY.unit}</strong></div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
