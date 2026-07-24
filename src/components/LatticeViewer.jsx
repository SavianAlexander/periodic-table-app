import React, { useState, useMemo } from 'react';

const ELEMENTS_LATTICE = [
  {
    symbol: 'Fe',
    name: 'Iron',
    system: 'BCC (Body-Centered Cubic)',
    coordinationNumber: 8,
    packingEfficiency: '68%',
    radiusPm: 126,
    color: '#747d8c',
    description: 'BCC structure has one atom in the center and 8 at the corners. High strength and moderate ductility.'
  },
  {
    symbol: 'Cu',
    name: 'Copper',
    system: 'FCC (Face-Centered Cubic)',
    coordinationNumber: 12,
    packingEfficiency: '74%',
    radiusPm: 128,
    color: '#ff7f50',
    description: 'FCC structure has atoms at all corners and the centers of all faces. Extremely ductile and conductive.'
  },
  {
    symbol: 'Au',
    name: 'Gold',
    system: 'FCC (Face-Centered Cubic)',
    coordinationNumber: 12,
    packingEfficiency: '74%',
    radiusPm: 144,
    color: '#eccc68',
    description: 'Gold crystallizes in the FCC system. High atomic packing provides outstanding malleability.'
  },
  {
    symbol: 'Mg',
    name: 'Magnesium',
    system: 'HCP (Hexagonal Close-Packed)',
    coordinationNumber: 12,
    packingEfficiency: '74%',
    radiusPm: 160,
    color: '#a4b0be',
    description: 'HCP close-packed structure with an ABABAB layering sequence. Offers a high strength-to-weight ratio.'
  },
  {
    symbol: 'Na',
    name: 'Sodium',
    system: 'BCC (Body-Centered Cubic)',
    coordinationNumber: 8,
    packingEfficiency: '68%',
    radiusPm: 186,
    color: '#2ed573',
    description: 'Sodium is a soft alkali metal with a spacious BCC cell, leading to low density.'
  },
  {
    symbol: 'Zn',
    name: 'Zinc',
    system: 'HCP (Hexagonal Close-Packed)',
    coordinationNumber: 12,
    packingEfficiency: '74%',
    radiusPm: 134,
    color: '#70a1ff',
    description: 'Zinc packs in a slightly elongated HCP lattice, leading to unique anisotropic mechanical traits.'
  }
];

export function LatticeViewer() {
  const [activeElement, setActiveElement] = useState(ELEMENTS_LATTICE[0]);
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(-35);
  const [opacity, setOpacity] = useState(0.85);

  // Define 3D points (x, y, z) for lattices centered around (0,0,0)
  const latticePoints = useMemo(() => {
    const sys = activeElement.system;
    
    if (sys.includes('BCC')) {
      return [
        // Corner atoms (8 corners of a cube)
        { x: -70, y: -70, z: -70, type: 'corner' },
        { x: 70, y: -70, z: -70, type: 'corner' },
        { x: 70, y: 70, z: -70, type: 'corner' },
        { x: -70, y: 70, z: -70, type: 'corner' },
        { x: -70, y: -70, z: 70, type: 'corner' },
        { x: 70, y: -70, z: 70, type: 'corner' },
        { x: 70, y: 70, z: 70, type: 'corner' },
        { x: -70, y: 70, z: 70, type: 'corner' },
        // Center atom
        { x: 0, y: 0, z: 0, type: 'center' }
      ];
    } else if (sys.includes('FCC')) {
      return [
        // Corners
        { x: -70, y: -70, z: -70, type: 'corner' },
        { x: 70, y: -70, z: -70, type: 'corner' },
        { x: 70, y: 70, z: -70, type: 'corner' },
        { x: -70, y: 70, z: -70, type: 'corner' },
        { x: -70, y: -70, z: 70, type: 'corner' },
        { x: 70, y: -70, z: 70, type: 'corner' },
        { x: 70, y: 70, z: 70, type: 'corner' },
        { x: -70, y: 70, z: 70, type: 'corner' },
        // Face Centers
        { x: 0, y: 0, z: -70, type: 'face' }, // back
        { x: 0, y: 0, z: 70, type: 'face' },  // front
        { x: -70, y: 0, z: 0, type: 'face' }, // left
        { x: 70, y: 0, z: 0, type: 'face' },  // right
        { x: 0, y: -70, z: 0, type: 'face' }, // top
        { x: 0, y: 70, z: 0, type: 'face' }   // bottom
      ];
    } else {
      // HCP Hexagonal Prism
      const pts = [];
      // Top hexagon (z = 70)
      for (let i = 0; i < 6; i++) {
        const rad = (i * 60 * Math.PI) / 180;
        pts.push({ x: 75 * Math.cos(rad), y: 75 * Math.sin(rad), z: 70, type: 'corner' });
      }
      pts.push({ x: 0, y: 0, z: 70, type: 'center' });

      // Bottom hexagon (z = -70)
      for (let i = 0; i < 6; i++) {
        const rad = (i * 60 * Math.PI) / 180;
        pts.push({ x: 75 * Math.cos(rad), y: 75 * Math.sin(rad), z: -70, type: 'corner' });
      }
      pts.push({ x: 0, y: 0, z: -70, type: 'center' });

      // Mid-layer triangle (3 atoms, z = 0)
      const radOffset = (30 * Math.PI) / 180;
      for (let i = 0; i < 3; i++) {
        const rad = radOffset + (i * 120 * Math.PI) / 180;
        pts.push({ x: 43.3 * Math.cos(rad), y: 43.3 * Math.sin(rad), z: 0, type: 'mid' });
      }
      return pts;
    }
  }, [activeElement]);

  // Cubic wireframe bounding lines
  const wireframeLines = useMemo(() => {
    const sys = activeElement.system;
    if (sys.includes('HCP')) {
      const lines = [];
      // Top hexagon lines
      for (let i = 0; i < 6; i++) {
        lines.push({ start: i, end: (i + 1) % 6 });
      }
      // Bottom hexagon lines
      for (let i = 0; i < 6; i++) {
        lines.push({ start: i + 7, end: ((i + 1) % 6) + 7 });
      }
      // Connecting vertical edges
      for (let i = 0; i < 6; i++) {
        lines.push({ start: i, end: i + 7 });
      }
      return lines;
    } else {
      // Cube outlines (BCC/FCC)
      return [
        { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 0 }, // back face
        { start: 4, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 4 }, // front face
        { start: 0, end: 4 }, { start: 1, end: 5 }, { start: 2, end: 6 }, { start: 3, end: 7 }  // connectors
      ];
    }
  }, [activeElement]);

  // Rotates a single 3D coordinate based on precomputed sine/cosine constants
  const projectPoint = (pt, cosX, sinX, cosY, sinY) => {
    let x1 = pt.x * cosY + pt.z * sinY;
    let z1 = -pt.x * sinY + pt.z * cosY;

    let y2 = pt.y * cosX - z1 * sinX;
    let z2 = pt.y * sinX + z1 * cosX;

    // Apply translation to SVG center (150, 150)
    return {
      x: 150 + x1,
      y: 130 + y2,
      z: z2, // depth for painter's algorithm
      type: pt.type
    };
  };

  // Projected atoms sorted by depth Z (back atoms first)
  const projectedAtoms = useMemo(() => {
    const rx = (rotX * Math.PI) / 180;
    const ry = (rotY * Math.PI) / 180;
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);

    const projected = latticePoints.map((pt, idx) => ({
      ...projectPoint(pt, cosX, sinX, cosY, sinY),
      idx
    }));
    return projected.sort((a, b) => a.z - b.z);
  }, [latticePoints, rotX, rotY]);

  // Projected wireframe line coordinates
  const projectedLines = useMemo(() => {
    const rx = (rotX * Math.PI) / 180;
    const ry = (rotY * Math.PI) / 180;
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);

    return wireframeLines.map(line => {
      const p1 = projectPoint(latticePoints[line.start], cosX, sinX, cosY, sinY);
      const p2 = projectPoint(latticePoints[line.end], cosX, sinX, cosY, sinY);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, [latticePoints, wireframeLines, rotX, rotY]);

  return (
    <div className="lattice-viewer-container" style={{
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
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>3D Crystal Lattice Visualizer</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Select an element to analyze its atomic unit cell structures and packing fraction parameters.
          </p>
        </div>

        {/* Element toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {ELEMENTS_LATTICE.map(el => (
            <button
              key={el.symbol}
              onClick={() => setActiveElement(el)}
              style={{
                background: activeElement.symbol === el.symbol ? '#00f2fe' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: activeElement.symbol === el.symbol ? '#000' : '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.15s ease'
              }}
              className={`lattice-element-btn ${activeElement.symbol === el.symbol ? 'active' : ''}`}
            >
              {el.name} ({el.symbol})
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        alignItems: 'start'
      }} className="lattice-dashboard-layout">
        
        {/* Left Side: 3D Projection Canvas & Rotational Sliders */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Canvas SVG */}
          <svg
            viewBox="0 0 300 260"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '20px',
              overflow: 'visible'
            }}
          >
            {/* Draw Wireframe edges */}
            {projectedLines.map((line, idx) => (
              <line
                key={idx}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
              />
            ))}

            {/* Draw Spheres (Sorted by depth for correct 3D occlusion) */}
            {projectedAtoms.map((a) => {
              // Standard scale radius based on element atomic radius
              // Scale to fit: map pm radius (120 - 180) to screen pixel radius (16 - 24)
              const baseR = 15 + ((activeElement.radiusPm - 120) / 70) * 10;
              // Perspective factor (front spheres look slightly bigger)
              const radius = baseR * (1 + a.z / 250);

              // Colors based on atom positions (Corner vs Face/Center)
              let color = activeElement.color;
              if (a.type === 'center') color = '#00f2fe';
              if (a.type === 'face') color = '#ffa502';
              if (a.type === 'mid') color = '#2ed573';

              return (
                <g key={a.idx}>
                  {/* Subtle 3D gradient highlight inside circle */}
                  <circle
                    cx={a.x}
                    cy={a.y}
                    r={radius}
                    fill={color}
                    opacity={opacity}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                    style={{
                      transition: 'fill 0.15s ease',
                      filter: a.type === 'center' ? 'drop-shadow(0 0 3px #00f2fe)' : 'none'
                    }}
                  />
                  {/* Highlight core/reflection dot */}
                  <circle
                    cx={a.x - radius * 0.3}
                    cy={a.y - radius * 0.3}
                    r={radius * 0.25}
                    fill="rgba(255,255,255,0.5)"
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </svg>

          {/* Sliders */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Rotation X:</span>
                <span>{rotX}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotX}
                onChange={(e) => setRotX(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
                className="lattice-slider-x"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Rotation Y:</span>
                <span>{rotY}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotY}
                onChange={(e) => setRotY(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
                className="lattice-slider-y"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Atom Opacity:</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                style={{ width: '100%', cursor: 'pointer' }}
                className="lattice-slider-opacity"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Information parameters panel */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          color: '#fff',
          height: '100%',
          boxSizing: 'border-box'
        }} className="lattice-info-card">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#00f2fe' }}>Lattice Parameters</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Crystal System</span>
              <strong style={{ fontSize: '1rem' }}>{activeElement.system}</strong>
            </div>

            <div>
              <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Packing Efficiency</span>
              <strong style={{ fontSize: '1.3rem', color: '#00f2fe' }}>{activeElement.packingEfficiency}</strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block' }}>Percentage of space occupied by atoms</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Coordination No.</span>
                <strong style={{ fontSize: '1.1rem' }}>{activeElement.coordinationNumber}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Atomic Radius</span>
                <strong style={{ fontSize: '1.1rem' }}>{activeElement.radiusPm} pm</strong>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />

            <div>
              <span style={{ opacity: 0.6, display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Overview</span>
              <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4', opacity: 0.85 }}>{activeElement.description}</p>
            </div>

            {/* Visual Color Legend */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.75rem'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>Atom Position Color Guide</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: activeElement.color }} />
                  <span>Corner Atoms (Shared by adjacent cells)</span>
                </div>
                {activeElement.system.includes('BCC') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#00f2fe' }} />
                    <span>Body-Center Atom (Internal to cell)</span>
                  </div>
                )}
                {activeElement.system.includes('FCC') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ffa502' }} />
                    <span>Face-Center Atoms (Shared by 2 cells)</span>
                  </div>
                )}
                {activeElement.system.includes('HCP') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#2ed573' }} />
                    <span>Mid-Layer Triangle Atoms</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
