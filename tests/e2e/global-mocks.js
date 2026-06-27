console.log('GLOBAL MOCKS LOADED AND RUNNING');
window.__speechSynthesisCalls = [];

class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.voice = null;
  }
}

const mockSpeechSynthesis = {
  speak(utterance) {
    window.__speechSynthesisCalls.push({
      method: 'speak',
      text: utterance ? utterance.text : ''
    });
  },
  cancel() {
    window.__speechSynthesisCalls.push({ method: 'cancel' });
  },
  pause() {
    window.__speechSynthesisCalls.push({ method: 'pause' });
  },
  resume() {
    window.__speechSynthesisCalls.push({ method: 'resume' });
  },
  getVoices() {
    return [
      { lang: 'en', name: 'English Voice' },
      { lang: 'es', name: 'Spanish Voice' },
      { lang: 'fr', name: 'French Voice' }
    ];
  },
  paused: false,
  pending: false,
  speaking: false,
  onvoiceschanged: null
};

// Define on window
try {
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: MockSpeechSynthesisUtterance,
    configurable: true,
    writable: true
  });
} catch (e) {
  try {
    Object.defineProperty(Window.prototype, 'SpeechSynthesisUtterance', {
      value: MockSpeechSynthesisUtterance,
      configurable: true,
      writable: true
    });
  } catch (err) {
    try {
      window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    } catch (err2) {
      console.error('Failed to define SpeechSynthesisUtterance:', err2);
    }
  }
}

try {
  // Try defining as a getter on window
  try {
    Object.defineProperty(window, 'speechSynthesis', {
      get() { return mockSpeechSynthesis; },
      configurable: true
    });
  } catch (e1) {
    // Try defining as a value on window
    try {
      Object.defineProperty(window, 'speechSynthesis', {
        value: mockSpeechSynthesis,
        configurable: true,
        writable: true
      });
    } catch (e2) {
      // Try defining as a getter on Window.prototype
      try {
        Object.defineProperty(Window.prototype, 'speechSynthesis', {
          get() { return mockSpeechSynthesis; },
          configurable: true
        });
      } catch (e3) {
        // Try defining as a value on Window.prototype
        try {
          Object.defineProperty(Window.prototype, 'speechSynthesis', {
            value: mockSpeechSynthesis,
            configurable: true,
            writable: true
          });
        } catch (e4) {
          // Final fallback: just try assignment
          try {
            window.speechSynthesis = mockSpeechSynthesis;
          } catch (e5) {
            console.error('Failed to mock speechSynthesis:', e5);
          }
        }
      }
    }
  }
} catch (outerError) {
  console.error('Outer error in speechSynthesis mocking:', outerError);
}

// Stub HTMLMediaElement.prototype.play and pause
try {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    value: function () {
      return Promise.resolve();
    },
    configurable: true,
    writable: true
  });
} catch (e) {}

try {
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    value: function () {
      // no-op
    },
    configurable: true,
    writable: true
  });
} catch (e) {}

// Disable all CSS transitions and animations to speed up testing
try {
  const injectStyle = () => {
    const style = document.createElement('style');
    style.id = 'playwright-speed-overrides';
    style.innerHTML = `
      * {
        transition: none !important;
        transition-duration: 0s !important;
        animation: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `;
    if (document.head) {
      document.head.appendChild(style);
    } else if (document.documentElement) {
      document.documentElement.appendChild(style);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyle);
  } else {
    injectStyle();
  }
} catch (e) {}

