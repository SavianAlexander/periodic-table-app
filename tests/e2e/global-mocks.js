// Global mock for speech synthesis and HTMLMediaElement methods to prevent browser teardown hangs in E2E tests

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
Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  configurable: true,
  writable: true
});

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  configurable: true,
  writable: true
});

// Stub HTMLMediaElement.prototype.play and pause
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  value: function () {
    return Promise.resolve();
  },
  configurable: true,
  writable: true
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  value: function () {
    // no-op
  },
  configurable: true,
  writable: true
});
