import React from 'react';

// Maps a wavelength (380nm - 780nm) to its RGB color using the Dan Bruton algorithm
export function waveToColorBruton(wavelength) {
  let r = 0, g = 0, b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0.0;
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  // Intensity fall-off near vision limits (380-420nm and 700-780nm)
  let factor = 0.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength <= 700) {
    factor = 1.0;
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  }

  const gamma = 0.8;
  const R = r > 0 ? Math.round(255 * Math.pow(r * factor, gamma)) : 0;
  const G = g > 0 ? Math.round(255 * Math.pow(g * factor, gamma)) : 0;
  const B = b > 0 ? Math.round(255 * Math.pow(b * factor, gamma)) : 0;

  return `rgb(${R}, ${G}, ${B})`;
}

export function EmissionSpectra({ spectra }) {
  // Validate that spectra exists and is a non-empty numeric array
  if (!spectra || !Array.isArray(spectra) || spectra.length === 0 || !spectra.every(w => typeof w === 'number')) {
    return <p className="highlight-box">Data not available</p>;
  }

  // Filter visible wavelengths in the 380nm to 750nm range as requested
  const visibleSpectra = spectra.filter(w => w >= 380 && w <= 750);

  return (
    <div className="spectra-visualization-container" style={{ marginTop: '10px' }}>
      <style>{`
        .spectra-line {
          position: relative;
        }
        .spectra-line:hover .spectra-tooltip {
          visibility: visible;
          opacity: 1;
        }
        .spectra-tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          bottom: 105%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(10, 10, 10, 0.9);
          color: #ffffff;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          z-index: 99;
          font-weight: 500;
        }
      `}</style>
      <div 
        className="emission-spectra-visualizer-container" 
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.6), 0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div 
          className="spectra-bands" 
          style={{
            position: 'relative',
            height: '44px',
            background: 'linear-gradient(90deg, #000000 0%, #050505 50%, #000000 100%)',
            borderRadius: '6px',
            overflow: 'visible', /* changed from hidden to let tooltips pop out of bounds if needed */
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          {visibleSpectra.map((wave, idx) => {
            const color = waveToColorBruton(wave);
            const positionPct = ((wave - 380) / (750 - 380)) * 100;
            return (
              <div
                key={idx}
                className="spectra-line"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${positionPct}%`,
                  width: '2px',
                  backgroundColor: color,
                  boxShadow: `0 0 10px 1.5px ${color}`,
                  opacity: 0.95,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                title={`${wave} nm`}
              >
                <span className="spectra-tooltip">{wave} nm</span>
              </div>
            );
          })}
        </div>
        
        <div 
          className="spectra-numeric" 
          style={{ 
            marginTop: '10px', 
            fontSize: '0.85rem', 
            opacity: 0.8,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}
        >
          {spectra.map(w => `${w} nm`).join(', ')}
        </div>
      </div>
    </div>
  );
}
