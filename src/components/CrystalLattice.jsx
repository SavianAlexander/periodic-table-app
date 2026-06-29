import React, { useEffect, useRef, useState } from 'react';

// Define the 3D coordinates of atoms for different lattice types
const LATTICES = {
  // Simple Cubic: 8 corners
  'simple cubic': {
    nodes: [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ]
  },
  // Body-Centered Cubic (BCC): 8 corners + 1 center
  'bcc': {
    nodes: [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
      [0, 0, 0] // Center
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Connect corners to center
      [0, 8], [1, 8], [2, 8], [3, 8],
      [4, 8], [5, 8], [6, 8], [7, 8]
    ]
  },
  // Face-Centered Cubic (FCC): 8 corners + 6 face centers
  'fcc': {
    nodes: [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
      // Face centers
      [0, 0, -1], [0, 0, 1],  // Back, Front
      [0, -1, 0], [0, 1, 0],  // Bottom, Top
      [-1, 0, 0], [1, 0, 0]   // Left, Right
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Connect face centers to their face corners
      [8, 0], [8, 1], [8, 2], [8, 3], // Back face
      [9, 4], [9, 5], [9, 6], [9, 7], // Front face
      [10, 0], [10, 1], [10, 5], [10, 4], // Bottom face
      [11, 3], [11, 2], [11, 6], [11, 7], // Top face
      [12, 0], [12, 3], [12, 7], [12, 4], // Left face
      [13, 1], [13, 2], [13, 6], [13, 5]  // Right face
    ]
  },
  // Hexagonal Close-Packed (HCP): Simplified prism representation
  'hcp': {
    nodes: [
      // Bottom hexagon
      [0, -1.2, -1], [0.86, -0.6, -1], [0.86, 0.6, -1], [0, 1.2, -1], [-0.86, 0.6, -1], [-0.86, -0.6, -1], [0, 0, -1],
      // Top hexagon
      [0, -1.2, 1],  [0.86, -0.6, 1],  [0.86, 0.6, 1],  [0, 1.2, 1],  [-0.86, 0.6, 1],  [-0.86, -0.6, 1],  [0, 0, 1],
      // Middle triangle
      [0, 0.69, 0], [-0.6, -0.35, 0], [0.6, -0.35, 0]
    ],
    bonds: [
      // Bottom face
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
      // Top face
      [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 7],
      [7, 13], [8, 13], [9, 13], [10, 13], [11, 13], [12, 13],
      // Vertical connectors
      [0, 7], [1, 8], [2, 9], [3, 10], [4, 11], [5, 12]
    ]
  },
  // Diamond Cubic
  'diamond': {
    nodes: [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
      // Face centers
      [0, 0, -1], [0, 0, 1], [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0],
      // Internal tetrahedrons
      [-0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, -0.5, 0.5]
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Connect tetrahedrons
      [14, 0], [14, 10], [14, 12], [14, 8],
      [15, 2], [15, 11], [15, 13], [15, 8],
      [16, 3], [16, 11], [16, 12], [16, 9],
      [17, 5], [17, 10], [17, 13], [17, 9]
    ]
  }
};

export function CrystalLattice({ structure }) {
  const canvasRef = useRef(null);
  const [angleX, setAngleX] = useState(0.5);
  const [angleY, setAngleY] = useState(0.5);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Map input crystal structure description to a supported key
  const getLatticeKey = (str) => {
    if (!str) return 'simple cubic';
    const lower = str.toLowerCase();
    if (lower.includes('bcc') || lower.includes('body-centered')) return 'bcc';
    if (lower.includes('fcc') || lower.includes('face-centered') || lower.includes('cubic close-packed')) return 'fcc';
    if (lower.includes('hcp') || lower.includes('hexagonal close')) return 'hcp';
    if (lower.includes('diamond')) return 'diamond';
    return 'simple cubic';
  };

  const latticeKey = getLatticeKey(structure);
  const data = LATTICES[latticeKey];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.min(width, height) * 0.25;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project 3D nodes to 2D screen coordinates
      const projectedNodes = data.nodes.map(([x, y, z]) => {
        // Rotate Y
        let nx = x * cosY - z * sinY;
        let nz = x * sinY + z * cosY;
        // Rotate X
        let ny = y * cosX - nz * sinX;
        let finalZ = y * sinX + nz * cosX;

        // Apply scale & perspective shift
        const screenX = width / 2 + nx * scale;
        const screenY = height / 2 + ny * scale;

        return { x: screenX, y: screenY, z: finalZ };
      });

      // Draw bonds (lines)
      ctx.lineWidth = 2;
      data.bonds.forEach(([i, j]) => {
        const nodeA = projectedNodes[i];
        const nodeB = projectedNodes[j];
        
        // Depth-based opacity for bonds
        const avgZ = (nodeA.z + nodeB.z) / 2;
        const alpha = Math.max(0.1, 0.7 - avgZ * 0.15);
        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.stroke();
      });

      // Draw nodes (atoms)
      projectedNodes.forEach((node) => {
        const radius = Math.max(4, 8 - node.z * 1.5);
        
        // Sphere gradient
        const grad = ctx.createRadialGradient(
          node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.1,
          node.x, node.y, radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, '#00f2fe');
        grad.addColorStop(1, '#00b4d8');

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        
        // Shadow glow
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = radius * 0.8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
    };

    render();

    // Auto rotate slightly when not dragging
    if (!isDragging.current) {
      animId = requestAnimationFrame(() => {
        setAngleY(prev => prev + 0.005);
      });
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [angleX, angleY, data]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    setAngleY(prev => prev + deltaX * 0.01);
    setAngleX(prev => prev + deltaY * 0.01);
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span>Lattice: <strong style={{ color: '#00f2fe', textTransform: 'capitalize' }}>{structure || 'Unknown'}</strong></span>
        <span style={{ opacity: 0.6 }}>Drag to rotate</span>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={220}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: 'grab',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '300px',
          height: '220px'
        }}
      />
    </div>
  );
}
