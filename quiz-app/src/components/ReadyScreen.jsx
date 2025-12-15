import { useState } from 'react';
import './ReadyScreen.css';
import { playGameStartSound } from '../utils/sounds';

function ReadyScreen({ player, onStart }) {
  const [isStarting, setIsStarting] = useState(false);

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

        <div className="ready-player">
          <span className="ready-player-label">Jucător selectat:</span>
          <span className="ready-player-name">{player.name}</span>
        </div>

        <h1 className="ready-title">
          <span className="ready-line">EȘTI PREGĂTIT</span>
          <span className="ready-line highlight">SĂ FII MILIONAR?</span>
        </h1>

        <button className="start-game-button" onClick={handleStart} disabled={isStarting}>
          {isStarting ? 'SE ÎNCARCĂ...' : 'ÎNCEPE JOCUL'}
        </button>
      </div>

      <div className="ready-effects">
        <div className="spotlight spotlight-1"></div>
        <div className="spotlight spotlight-2"></div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${Math.random() * 5}s`,
              '--x': `${Math.random() * 100}%`,
              '--duration': `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReadyScreen;
