import React, { useState } from 'react';
import elements from '../data/elements.json';

const QUESTIONS = [
  {
    text: "Find the Noble Gas located in Period 3.",
    check: (el) => el.groupBlock?.toLowerCase() === 'noble gas' && el.period === 3,
    hint: "Noble gases are in Group 18 (last column). Period 3 is the third row.",
    explanation: "Correct! Argon (Ar, Atomic Number 18) is a noble gas in Period 3.",
    fact: "Argon is used inside double-pane thermal windows because it is a very poor thermal conductor, helping prevent heat loss!"
  },
  {
    text: "Find the Halogen with the lowest atomic number.",
    check: (el) => el.groupBlock?.toLowerCase() === 'halogen' && el.atomicNumber === 9,
    hint: "Halogens are in Group 17. The top one has the lowest atomic number.",
    explanation: "Correct! Fluorine (F, Atomic Number 9) is the halogen with the lowest atomic number.",
    fact: "Fluorine is the most electronegative and chemically reactive element on the periodic table. It reacts with almost everything, including glass!"
  },
  {
    text: "Find the Alkali Metal located in Period 4.",
    check: (el) => el.groupBlock?.toLowerCase() === 'alkali metal' && el.period === 4,
    hint: "Alkali metals are in Group 1 (first column, excluding Hydrogen).",
    explanation: "Correct! Potassium (K, Atomic Number 19) is the alkali metal in Period 4.",
    fact: "Potassium ions (K⁺) are critical for biological electrical signals. High concentrations of potassium inside cells maintain osmotic balance and nerve signaling!"
  },
  {
    text: "Find the transition metal in Period 4 with exactly 26 protons.",
    check: (el) => el.groupBlock?.toLowerCase() === 'transition metal' && el.atomicNumber === 26,
    hint: "The number of protons equals the element's atomic number.",
    explanation: "Correct! Iron (Fe, Atomic Number 26) is a transition metal with 26 protons.",
    fact: "Iron is the key component in hemoglobin, the oxygen-carrying protein in red blood cells that colors our blood red!"
  },
  {
    text: "Find the element in Period 2 with the highest electronegativity.",
    check: (el) => el.period === 2 && el.atomicNumber === 9,
    hint: "Electronegativity increases up and to the right of the periodic table.",
    explanation: "Correct! Fluorine (F) has the highest electronegativity (3.98) on the periodic table.",
    fact: "Because of its high electronegativity, Fluorine forms the strongest single covalent bonds in chemistry, which are heavily utilized in Teflon coatings."
  },
  {
    text: "Find the Alkaline Earth Metal in Period 3.",
    check: (el) => el.groupBlock?.toLowerCase() === 'alkaline earth metal' && el.period === 3,
    hint: "Alkaline Earth metals are in Group 2 (second column).",
    explanation: "Correct! Magnesium (Mg, Atomic Number 12) is the alkaline earth metal in Period 3.",
    fact: "Magnesium forms the center of the chlorophyll molecule, enabling plants to capture sunlight and run photosynthesis!"
  },
  {
    text: "Find the Metalloid located in Period 2.",
    check: (el) => el.groupBlock?.toLowerCase() === 'metalloid' && el.period === 2,
    hint: "Period 2 is the second row. Look on the border between metals and nonmetals.",
    explanation: "Correct! Boron (B, Atomic Number 5) is the metalloid in Period 2.",
    fact: "Boron silicate glass (Pyrex) is highly resistant to thermal shock, making it ideal for laboratory beakers and cooking dishes!"
  },
  {
    text: "Find the liquid Transition Metal at standard temperature and pressure.",
    check: (el) => el.symbol === 'Hg',
    hint: "It is commonly known as quicksilver and was used in glass thermometers.",
    explanation: "Correct! Mercury (Hg, Atomic Number 80) is the liquid transition metal.",
    fact: "Mercury is the only metal that is liquid at standard room temperature, due to weak metal-to-metal bonding between its atoms!"
  },
  {
    text: "Find the element whose ground-state electron configuration ends in 2p⁶.",
    check: (el) => el.symbol === 'Ne',
    hint: "A fully filled 2p subshell means it is a Noble Gas in Period 2.",
    explanation: "Correct! Neon (Ne, Atomic Number 10) ends in 1s² 2s² 2p⁶.",
    fact: "Neon glows with a brilliant reddish-orange color when excited by electric current, making it the signature gas for advertising signs!"
  },
  {
    text: "Find the only reactive Nonmetal in Group 14.",
    check: (el) => el.symbol === 'C',
    hint: "It is the central building block of organic chemistry and life.",
    explanation: "Correct! Carbon (C, Atomic Number 6) is the only reactive nonmetal in Group 14.",
    fact: "Carbon is unique in its ability to form stable chains and rings of covalent bonds, a property called catenation that underpins all organic chemistry!"
  },
  {
    text: "Find the Noble Gas in Period 1.",
    check: (el) => el.symbol === 'He',
    hint: "It is the second most abundant element in the universe, lighter than air.",
    explanation: "Correct! Helium (He, Atomic Number 2) is the noble gas in Period 1.",
    fact: "Helium remains a gas even at absolute zero under normal pressure, and is widely used to cool superconducting magnets in MRI scanners!"
  },
  {
    text: "Find the Metalloid in Period 3.",
    check: (el) => el.groupBlock?.toLowerCase() === 'metalloid' && el.period === 3,
    hint: "It is the second most abundant element in Earth's crust, crucial for computer chips.",
    explanation: "Correct! Silicon (Si, Atomic Number 14) is the metalloid in Period 3.",
    fact: "Silicon is a semiconductor, meaning its electrical conductivity can be precisely controlled, making it the foundation of modern microelectronics!"
  }
];

import { useEffect } from 'react';

export function ElementQuiz() {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [showFact, setShowFact] = useState(false);

  // Time Attack states
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const question = QUESTIONS[qIdx];

  useEffect(() => {
    let timer;
    if (isTimeAttack && gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
      }
    }
    return () => clearInterval(timer);
  }, [isTimeAttack, gameActive, timeLeft, score, highScore]);

  const handleAnswerSubmit = () => {
    if (!selectedSymbol || !gameActive) return;
    const el = elements.find(item => item.symbol.toLowerCase() === selectedSymbol.toLowerCase());
    
    if (el && question.check(el)) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedback(`🟢 ${question.explanation}`);
      setShowFact(true);
    } else {
      setStreak(0);
      setFeedback(`❌ Incorrect. Hint: ${question.hint}`);
      setShowFact(false);
    }
    setAttempts(prev => prev + 1);
  };

  const handleNext = () => {
    if (!gameActive) return;
    setQIdx((qIdx + 1) % QUESTIONS.length);
    setFeedback('');
    setSelectedSymbol('');
    setShowFact(false);
  };

  const resetQuiz = () => {
    setQIdx(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback('');
    setSelectedSymbol('');
    setShowFact(false);
    setTimeLeft(60);
    setGameActive(true);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Periodic Table Explorer Quiz</h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              onClick={() => { setIsTimeAttack(false); resetQuiz(); }}
              style={{
                background: !isTimeAttack ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${!isTimeAttack ? '#00f2fe' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              Practice Mode
            </button>
            <button
              onClick={() => { setIsTimeAttack(true); resetQuiz(); }}
              style={{
                background: isTimeAttack ? 'rgba(255, 71, 87, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isTimeAttack ? '#ff4757' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              ⏱️ Time Attack
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTimeAttack && (
            <span style={{
              background: timeLeft <= 10 ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${timeLeft <= 10 ? '#ff4757' : 'rgba(255,255,255,0.1)'}`,
              color: timeLeft <= 10 ? '#ff4757' : '#fff',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '4px 10px'
            }}>
              ⏳ {timeLeft}s
            </span>
          )}
          {streak > 1 && (
            <span style={{
              background: 'linear-gradient(135deg, #ffa502, #ff4757)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '3px 8px',
              boxShadow: '0 0 10px rgba(255, 71, 87, 0.4)'
            }}>
              🔥 {streak}x Streak!
            </span>
          )}
          <div style={{ fontSize: '0.9rem', color: '#00f2fe', fontWeight: 'bold', textAlign: 'right' }}>
            <div>Score: {score} / {attempts}</div>
            {highScore > 0 && <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>High: {highScore}</span>}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
        {!gameActive ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', gap: '16px' }}>
            <span style={{ fontSize: '3rem' }}>⏳</span>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#ff4757' }}>Time's Up!</h3>
            <p style={{ margin: 0, fontSize: '1.05rem' }}>You correctly answered <strong>{score}</strong> out of <strong>{attempts}</strong> clues!</p>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>High Score: {highScore}</p>
            <button
              onClick={resetQuiz}
              style={{
                background: '#ff4757',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)'
              }}
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
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

            {showFact && (
              <div style={{
                background: 'rgba(46, 213, 115, 0.05)',
                border: '1px solid rgba(46, 213, 115, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '8px',
                fontSize: '0.9rem',
                color: '#2ed573',
                lineHeight: '1.45'
              }}>
                🎓 <strong>Did you know?</strong> {question.fact}
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
          </>
        )}
      </div>
    </div>
  );
}
