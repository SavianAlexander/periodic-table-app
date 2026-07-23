import React from 'react';

const NGSS_STANDARDS = [
  {
    code: 'HS-PS1-1',
    title: 'Structure and Properties of Matter',
    description: 'Use the periodic table as a model to predict the relative properties of elements based on the patterns of electrons in the outermost energy levels of atoms.',
    linkedTools: ['Periodic Grid', 'Aufbau Sandbox', 'Lattice Viewer', 'Molecule Builder']
  },
  {
    code: 'HS-PS1-7',
    title: 'Conservation of Chemical Equations',
    description: 'Use mathematical representations to support the claim that atoms, and therefore mass, are conserved during a chemical reaction.',
    linkedTools: ['Equation Balancer']
  },
  {
    code: 'HS-PS1-8',
    title: 'Nuclear Decay Processes',
    description: 'Develop models to illustrate the changes in the composition of the nucleus of the atom and the energy released during the processes of fission, fusion, and radioactive decay.',
    linkedTools: ['Decay Simulator']
  }
];

const LAB_SHEETS = [
  {
    id: 'lab-covalent',
    title: 'Dr. Covalent: Organic Molecule Stabilities',
    objective: 'Build hydrocarbons and analyze valence shells using the Molecule Builder.',
    procedure: [
      'Navigate to the Molecule Builder tab.',
      'Clear the canvas and add exactly two Carbon atoms and six Hydrogen atoms.',
      'Bond the two Carbons together with a single covalent bond.',
      'Connect the remaining Hydrogen atoms to satisfy the valency of the Carbons.'
    ],
    questions: [
      'What compound is formed? (Identify the IUPAC name and molecular formula).',
      'Explain why the indicator ring around Carbon turns green only when it has exactly 4 bonds.'
    ]
  },
  {
    id: 'lab-halflife',
    title: 'Nuclear Decay: Modeling Half-Life Rates',
    objective: 'Measure and plot exponential decay rates using the Nuclear Decay Simulator.',
    procedure: [
      'Navigate to the Decay Simulator tab.',
      'Select Radium-226 from the active isotope dropdown.',
      'Click "Start Decay" and watch the SVG atoms grid transition in real-time.',
      'Observe the coordinates on the Decay Rate Curve graph.'
    ],
    questions: [
      'What daughter product is created when Radium-226 undergoes Alpha decay?',
      'How many half-lives must elapse before less than 25% of the parent nuclei remain?'
    ]
  },
  {
    id: 'lab-titration',
    title: 'Titration Lab: Analytical Neutralization',
    objective: 'Locate equivalence points in strong acid/strong base titrations.',
    procedure: [
      'Navigate to the Lab Simulator tab and click "Acid-Base Titration".',
      'Add NaOH titrant in 5.0 mL increments until pH starts rising rapidly.',
      'Fine-tune by adding 0.5 mL increments to locate the exact neutral pH 7.00.'
    ],
    questions: [
      'What exact volume of 0.1 M NaOH was required to neutralize the 50.0 mL of 0.1 M HCl?',
      'Describe the chemical composition of the beaker fluid at the equivalence point.'
    ]
  }
];

export function TeacherResources() {
  return (
    <div className="teacher-resources-container" style={{
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
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>Official Government K-12 Teacher Resources</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
          Government-grade curriculum alignments and downloadable guided student laboratory sheets.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }} className="resources-layout">

        {/* Left Side: NGSS Standards mapping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="standards-panel">
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00f2fe' }}>NGSS Curriculum Standards Alignment</h3>
          {NGSS_STANDARDS.map(std => (
            <div key={std.code} style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px',
              color: '#fff'
            }} className="standard-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#00f2fe', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{std.code}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>High School Physical Sciences</span>
              </div>
              <strong style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>{std.title}</strong>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.4' }}>{std.description}</p>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {std.linkedTools.map(t => (
                  <span key={t} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    opacity: 0.8
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Printable laboratory worksheets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="labsheets-panel">
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffa502' }}>Student Guided Laboratory Worksheets</h3>
          {LAB_SHEETS.map(sheet => (
            <div key={sheet.id} style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '16px',
              color: '#fff'
            }} className="labsheet-card">
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#ffa502', marginBottom: '6px' }}>{sheet.title}</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '10px' }}>
                <strong>Objective:</strong> {sheet.objective}
              </div>

              {/* Procedure */}
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6, display: 'block', marginBottom: '4px' }}>Procedure</strong>
                <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {sheet.procedure.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>
              </div>

              {/* Lab Questions */}
              <div>
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6, display: 'block', marginBottom: '4px' }}>Analysis Questions</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', opacity: 0.85, fontStyle: 'italic', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {sheet.questions.map((q, idx) => <li key={idx}>{q}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
