import React, { useEffect, useRef } from 'react';
import '../styles/main.css';

export function ElementModal({ element, difficulty, onClose }) {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

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
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = modalRef.current.querySelectorAll(focusableElements);
        if (focusableContent.length === 0) return;
        
        const firstFocusable = focusableContent[0];
        const lastFocusable = focusableContent[focusableContent.length - 1];

        if (!modalRef.current.contains(document.activeElement)) {
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

  return (
    <div className="modal-overlay" data-testid="modal-overlay" onClick={(e) => {
      if (e.detail > 1) return;
      onClose();
    }}>
      <div className="modal-content" role="dialog" aria-modal="true" data-testid="element-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className={`${difficulty === 'Advanced' ? 'density-high' : ''}`.trim()} data-testid="modal-content">
        <button ref={closeBtnRef} className="modal-close" onClick={onClose} data-testid="modal-close">&times;</button>
        <div className="modal-header">
          <h2><span data-testid="modal-element-name">{element.name}</span> ({element.symbol})</h2>
          <div className="modal-subtitle">Atomic Number: {element.atomicNumber} | Atomic Mass: {element.atomicMass}</div>
        </div>
        
        <div className="modal-body">
          {difficulty === 'Beginner' && (
            <div className="modal-section" data-testid="modal-everyday-uses">
              <h3>Everyday Uses</h3>
              {element.everydayUses && element.everydayUses.length > 0 ? (
                <ul>
                  {element.everydayUses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              ) : (
                <p>Data not available</p>
              )}
            </div>
          )}

          {difficulty === 'Intermediate' && (
            <div data-testid="modal-intermediate-details">
              <div className="modal-section">
                <h3>Group Block</h3>
                <p>{element.groupBlock}</p>
              </div>
              <div className="modal-section" data-testid="modal-everyday-uses">
                <h3>Everyday Uses</h3>
                {element.everydayUses && element.everydayUses.length > 0 ? (
                  <ul>
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

          {difficulty === 'Advanced' && (
            <div data-testid="modal-advanced-data">
              <div className="modal-section">
                <h3>Group Block</h3>
                <p>{element.groupBlock}</p>
              </div>
              <div className="modal-section">
                <h3>Electron Configuration</h3>
                <p dangerouslySetInnerHTML={{ __html: element.electronConfiguration ? element.electronConfiguration.replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>') : "Data not available" }}></p>
              </div>
              <div className="modal-section">
                <h3>Emission Spectra</h3>
                <p>{Array.isArray(element.emissionSpectra) ? element.emissionSpectra.join(', ') + ' nm' : (element.emissionSpectra || "Data not available")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
