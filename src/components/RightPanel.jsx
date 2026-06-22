import React, { useEffect, useRef, useState } from 'react';
import '../styles/main.css';
import { BohrModel } from './BohrModel';
import { EmissionSpectra } from './EmissionSpectra';

const formatProperty = (val, suffix = '') => {
  if (val === null || val === undefined || val === '') {
    return 'Data not available';
  }
  return `${val}${suffix}`;
};

const waveToColor = (wavelength) => {
  if (wavelength >= 380 && wavelength < 440) return 'rgb(75, 0, 130)'; // Violet
  if (wavelength >= 440 && wavelength < 490) return 'rgb(0, 0, 255)'; // Blue
  if (wavelength >= 490 && wavelength < 510) return 'rgb(0, 255, 255)'; // Cyan
  if (wavelength >= 510 && wavelength < 580) return 'rgb(0, 255, 0)'; // Green
  if (wavelength >= 580 && wavelength < 645) return 'rgb(255, 255, 0)'; // Yellow
  if (wavelength >= 645 && wavelength <= 780) return 'rgb(255, 0, 0)'; // Red
  return 'rgb(255, 255, 255)';
};

export function RightPanel({ element, difficulty, onClose }) {
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const [photoState, setPhotoState] = useState({ loading: true, error: false, url: '' });

  useEffect(() => {
    if (element) {
      const url = element.atomicNumber <= 94
        ? `https://images-of-elements.com/${element.name.toLowerCase()}.jpg`
        : null;
      setPhotoState({
        loading: !!url,
        error: !url,
        url: url || ''
      });
    }
  }, [element]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleTab = (e) => {
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = panelRef.current.querySelectorAll(focusableElements);
        if (focusableContent.length === 0) return;
        
        const firstFocusable = focusableContent[0];
        const lastFocusable = focusableContent[focusableContent.length - 1];

        if (!panelRef.current.contains(document.activeElement)) {
          firstFocusable.focus();
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener('keydown', handleTab);

    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!element) return null;

  // Compute a simple, elegant academic description of the element for Beginner overview
  const simpleDescription = `${element.name} (${element.symbol}) is a chemical element with atomic number ${element.atomicNumber}. Classified as a ${element.groupBlock ? element.groupBlock.toLowerCase() : 'chemical element'}, it has an atomic mass of ${element.atomicMass} u. ${Array.isArray(element.everydayUses) && element.everydayUses.length > 0 ? `It is commonly used in applications such as ${element.everydayUses.slice(0, 2).join(' and ')}.` : ''}`;

  const renderPhotoSection = () => {
    if (element.atomicNumber > 94) {
      return (
        <div className="right-panel-section photo-section">
          <h3>Real-World Appearance</h3>
          <div className="synthetic-fallback">
            <span className="radiation-warning">⚠️</span>
            <p><strong>Highly Synthetic & Radioactive</strong></p>
            <p className="synthetic-desc">This element is highly unstable. It decays too rapidly to exist in visible quantities for photographing.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="right-panel-section photo-section">
        <h3>Real-World Appearance</h3>
        <div className="element-photo-wrapper">
          {photoState.loading && <div className="photo-skeleton">Loading photo...</div>}
          {!photoState.error && (
            <img 
              src={photoState.url} 
              alt={`${element.name}`}
              className={`element-photo ${photoState.loading ? 'hidden' : ''}`}
              onLoad={() => setPhotoState(prev => ({ ...prev, loading: false }))}
              onError={() => setPhotoState(prev => ({ ...prev, loading: false, error: true }))}
            />
          )}
          {photoState.error && (
            <div className="photo-error-fallback">
              <p>Photo not available for {element.name}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="right-panel-overlay" data-testid="right-panel-overlay" onClick={(e) => {
        if (e.detail > 1) return;
        onClose();
      }}></div>
      
      <div className="right-panel" role="dialog" aria-modal="true" data-testid="right-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className={`${difficulty === 'Advanced' ? 'density-high' : ''} right-panel-content`.trim()} data-testid="right-panel-content">
          <button ref={closeBtnRef} className="right-panel-close" onClick={onClose} data-testid="right-panel-close" aria-label="Close panel">&times;</button>
          
          <div className="right-panel-header">
            <h2><span data-testid="right-panel-element-name">{element.name}</span> ({element.symbol})</h2>
            <div className="right-panel-subtitle">
              <span>Atomic Number: <strong>{element.atomicNumber}</strong></span>
              <span>Atomic Mass: <strong>{element.atomicMass}</strong></span>
            </div>
          </div>
          
          <div className="right-panel-body">
            
            {/* Beginner Mode Dashboard */}
            {difficulty === 'Beginner' && (
              <div className="dashboard-beginner">
                <div className="right-panel-section educational-section">
                  <h3>Element Overview</h3>
                  <p className="element-desc">{simpleDescription}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>Category:</strong> {element.groupBlock || 'Data not available'}</p>
                  </div>
                </div>
                {renderPhotoSection()}
                <div className="right-panel-section" data-testid="right-panel-everyday-uses">
                  <h3>Everyday Uses</h3>
                  {Array.isArray(element.everydayUses) && element.everydayUses.length > 0 ? (
                    <ul className="uses-list">
                      {element.everydayUses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Data not available</p>
                  )}
                </div>
              </div>
            )}

            {/* Intermediate Mode Dashboard */}
            {difficulty === 'Intermediate' && (
              <div className="dashboard-intermediate" data-testid="right-panel-intermediate-details">
                <div className="right-panel-section educational-section">
                  <h3>Element Overview</h3>
                  <p className="element-desc">{simpleDescription}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>Category:</strong> {element.groupBlock || 'Data not available'}</p>
                  </div>
                </div>
                {renderPhotoSection()}
                <div className="right-panel-section" data-testid="right-panel-everyday-uses">
                  <h3>Everyday Uses</h3>
                  {Array.isArray(element.everydayUses) && element.everydayUses.length > 0 ? (
                    <ul className="uses-list">
                      {element.everydayUses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Data not available</p>
                  )}
                </div>

                <div className="right-panel-section physical-properties">
                  <h3>Physical & Chemical Parameters</h3>
                  <div className="properties-grid">
                    <p><strong>State at Room Temp:</strong> {formatProperty(element.stateAtRoomTemp)}</p>
                    <p><strong>Melting Point:</strong> {formatProperty(element.meltingPoint, ' K')}</p>
                    <p><strong>Boiling Point:</strong> {formatProperty(element.boilingPoint, ' K')}</p>
                    <p><strong>Density:</strong> {formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ' g/L' : ' g/cm³')}</p>
                    <p><strong>Crystal Structure:</strong> {formatProperty(element.crystalStructure)}</p>
                    <p><strong>Discoverer:</strong> {formatProperty(element.discoverer)}</p>
                    <p><strong>Discovery Year:</strong> {formatProperty(element.discoveryYear)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Mode Dashboard */}
            {difficulty === 'Advanced' && (
              <div className="dashboard-advanced" data-testid="right-panel-advanced-data">
                <div className="right-panel-section educational-section">
                  <h3>Element Overview</h3>
                  <p className="element-desc">{simpleDescription}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>Category:</strong> {element.groupBlock || 'Data not available'}</p>
                  </div>
                </div>

                <div className="right-panel-section physical-properties">
                  <h3>Physical & Chemical Parameters</h3>
                  <div className="properties-grid">
                    <p><strong>State at Room Temp:</strong> {formatProperty(element.stateAtRoomTemp)}</p>
                    <p><strong>Melting Point:</strong> {formatProperty(element.meltingPoint, ' K')}</p>
                    <p><strong>Boiling Point:</strong> {formatProperty(element.boilingPoint, ' K')}</p>
                    <p><strong>Density:</strong> {formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ' g/L' : ' g/cm³')}</p>
                    <p><strong>Crystal Structure:</strong> {formatProperty(element.crystalStructure)}</p>
                    <p><strong>Discoverer:</strong> {formatProperty(element.discoverer)}</p>
                    <p><strong>Discovery Year:</strong> {formatProperty(element.discoveryYear)}</p>
                    <p><strong>Electronegativity:</strong> {formatProperty(element.electronegativity)}</p>
                    <p><strong>Ionization Energy:</strong> {formatProperty(element.ionizationEnergy, ' kJ/mol')}</p>
                  </div>
                </div>

                <div className="right-panel-section">
                  <h3>Electron Configuration</h3>
                  {element.electronConfiguration ? (
                    <p className="highlight-box" dangerouslySetInnerHTML={{ __html: typeof element.electronConfiguration === 'string' ? element.electronConfiguration.replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>') : "Data not available" }}></p>
                  ) : (
                    <p className="highlight-box">Data not available</p>
                  )}
                </div>

                <div className="right-panel-section isotopes-section">
                  <h3>Isotopes</h3>
                  {Array.isArray(element.isotopes) && element.isotopes.length > 0 ? (
                    <div className="isotopes-table-container">
                      <table className="isotopes-table">
                        <thead>
                          <tr>
                            <th>Isotope</th>
                            <th>Mass No.</th>
                            <th>Half-life</th>
                          </tr>
                        </thead>
                        <tbody>
                          {element.isotopes.map((iso, idx) => (
                            <tr key={idx}>
                              <td>{iso.isotopeName || 'Unknown'}</td>
                              <td>{iso.massNumber !== undefined ? iso.massNumber : 'Unknown'}</td>
                              <td>{iso.halfLife || 'Unknown'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="highlight-box">Data not available</p>
                  )}
                </div>

                {/* Bohr Model visualizer */}
                <div className="right-panel-section">
                  <h3>Interactive Bohr Model</h3>
                  <BohrModel element={element} />
                </div>

                {/* Emission Spectra visualizer */}
                <div className="right-panel-section">
                  <h3>Emission Spectra</h3>
                  <EmissionSpectra spectra={element.emissionSpectra} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
