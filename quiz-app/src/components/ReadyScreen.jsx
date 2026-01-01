import { useState } from 'react';
import './ReadyScreen.css';
import { playGameStartSound } from '../utils/sounds';

function ReadyScreen({ player, questionCount, onStart }) {
  const [isStarting, setIsStarting] = useState(false);
  const isFeminine = player.id === 'cezara' || player.id === 'leo';

  // Calculate max possible winnings
  const maxWinnings = Array.from({ length: questionCount }, (_, i) => player.questionValue + i * player.valueIncrement).reduce(
    (sum, val) => sum + val,
    0,
  );

  const handleStart = () => {
    setIsStarting(true);
    playGameStartSound();
    // Delay to let animation play
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  return (
    <div className={`ready-screen ${isStarting ? 'starting' : ''}`}>
      <div className="ready-content">
        <div className="ready-logo">
          <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" />
        </div>

        <h1 className="ready-title">
          <span className="ready-line">
            <span className="ready-player-name">{player.name}</span>, EȘTI {isFeminine ? 'PREGĂTITĂ' : 'PREGĂTIT'}
          </span>
          <span className="ready-line highlight">SĂ DEVII {isFeminine ? 'MILIONARĂ' : 'MILIONAR'}?</span>
        </h1>

        <div className="ready-rules">
          <div className="rule-item">
            <span className="rule-text">
              <strong>{questionCount}</strong>
              {questionCount >= 20 ? ' de' : ''} întrebări
            </span>
          </div>
          <div className="rule-item">
            <span className="rule-text">
              {player.valueIncrement > 0 ? 'Prima întrebare' : 'Fiecare întrebare'}: <strong>{player.questionValue} RON</strong>
            </span>
          </div>
          {player.valueIncrement > 0 && (
            <div className="rule-item">
              <span className="rule-text">
                Valoarea fiecărei întrebări crește cu <strong>{player.valueIncrement} RON</strong>
              </span>
            </div>
          )}
          <div className="rule-item">
            <span className="rule-text">Fără limită de timp</span>
          </div>
          <div className="rule-item highlight">
            <span className="rule-icon">🏆</span>
            <span className="rule-text" style={{ fontSize: '2em' }}>
              Premiul maxim posibil: <strong>10 RON</strong>
            </span>
          </div>
        </div>

        <button className="start-game-button" onClick={handleStart} disabled={isStarting}>
          {isStarting ? 'SE ÎNCARCĂ...' : 'ÎNCEPE JOCUL'}
        </button>
      </div>

      <div className="ready-effects">
        <div className="spotlight spotlight-1"></div>
        <div className="spotlight spotlight-2"></div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--x': `${Math.random() * 100}%`,
                '--duration': `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReadyScreen;
