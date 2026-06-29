import React from 'react'
import ReactDOM from 'react-dom/client'

// Initialize default Trusted Types policy to satisfy CSP require-trusted-types-for 'script' directive
if (typeof window !== 'undefined' && window.trustedTypes && !window.trustedTypes.defaultPolicy) {
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string) => string
    });
  } catch (e) {
    console.warn('TrustedTypes default policy creation failed:', e);
  }
}

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

