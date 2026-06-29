import React, { useState } from 'react';
import elements from '../data/elements.json';

const QUESTIONS = [
  {
    text: "Find the Noble Gas located in Period 3.",
    check: (el) => el.groupBlock?.toLowerCase() === 'noble gas' && el.period === 3,
    hint: "Noble gases are in Group 18 (last column). Period 3 is the third row.",
    explanation: "Correct! Argon (Ar, Atomic Number 18) is a noble gas in Period 3."
  },
  {
    text: "Find the Halogen with the lowest atomic number.",
    check: (el) => el.groupBlock?.toLowerCase() === 'halogen' && el.atomicNumber === 9,
    hint: "Halogens are in Group 17. The top one has the lowest atomic number.",
    explanation: "Correct! Fluorine (F, Atomic Number 9) is the halogen with the lowest atomic number."
  },
  {
    text: "Find the Alkali Metal located in Period 4.",
    check: (el) => el.groupBlock?.toLowerCase() === 'alkali metal' && el.period === 4,
    hint: "Alkali metals are in Group 1 (first column, excluding Hydrogen).",
    explanation: "Correct! Potassium (K, Atomic Number 19) is the alkali metal in Period 4."
  },
  {
    text: "Find the transition metal in Period 4 with exactly 26 protons.",
    check: (el) => el.groupBlock?.toLowerCase() === 'transition metal' && el.atomicNumber === 26,
    hint: "The number of protons equals the element's atomic number.",
    explanation: "Correct! Iron (Fe, Atomic Number 26) is a transition metal with 26 protons."
  },
  {
    text: "Find the element in Period 2 with the highest electronegativity.",
    check: (el) => el.period === 2 && el.atomicNumber === 9,
    hint: "Electronegativity increases up and to the right of the periodic table.",
    explanation: "Correct! Fluorine (F) has the highest electronegativity (3.98) on the periodic table."
  }
];

export function ElementQuiz() {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  const question = QUESTIONS[qIdx];

  const handleAnswerSubmit = () => {
    if (!selectedSymbol) return;
    const el = elements.find(item => item.symbol.toLowerCase() === selectedSymbol.toLowerCase());
    
    if (el && question.check(el)) {
      setScore(prev => prev + 1);
      setFeedback(`🟢 ${question.explanation}`);
    } else {
      setFeedback(`❌ Incorrect. Hint: ${question.hint}`);
    }
    setAttempts(prev => prev + 1);
  };

  const handleNext = () => {
    setQIdx((qIdx + 1) % QUESTIONS.length);
    setFeedback('');
    setSelectedSymbol('');
  };

  const resetQuiz = () => {
    setQIdx(0);
    setScore(0);
    setAttempts(0);
    setFeedback('');
    setSelectedSymbol('');
  };

  return (
    <div className="element-quiz-container" style={{
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
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Periodic Table Explorer Quiz</h2>
        <div style={{ fontSize: '0.9rem', color: '#00f2fe', fontWeight: 'bold' }}>
          Score: {score} / {attempts}
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Question {qIdx + 1}:</h3>
        <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.4 }}>{question.text}</p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              flex: '1 1 200px'
            }}
          >
            <option value="">-- Choose an Element --</option>
            {elements.map((el, i) => (
              <option key={i} value={el.symbol}>{el.atomicNumber}. {el.name} ({el.symbol})</option>
            ))}
          </select>

          <button
            onClick={handleAnswerSubmit}
            disabled={!selectedSymbol}
            style={{
              background: selectedSymbol ? '#00f2fe' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: selectedSymbol ? '#12131c' : 'rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: selectedSymbol ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            Submit Answer
          </button>
        </div>

        {feedback && (
          <div style={{ fontSize: '0.95rem', margin: '10px 0', lineHeight: 1.4 }}>
            {feedback}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={resetQuiz}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              padding: '6px 14px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Reset Game
          </button>
          <button
            onClick={handleNext}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              padding: '6px 14px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}
