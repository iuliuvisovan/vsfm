import { useEffect } from 'react';
import './Summary.css';
import { playVictorySound } from '../utils/sounds';

function Summary({ player, results, onRestart }) {
  const correctCount = results.filter((r) => r.isCorrect).length;

  useEffect(() => {
    playVictorySound();
  }, []);
  const totalQuestions = results.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Calculate total won
  const totalWon = results.reduce((sum, result, index) => {
    if (result.isCorrect) {
      const questionValue = player.questionValue + index * player.valueIncrement;
      return sum + questionValue;
    }
    return sum;
  }, 0);

  // Calculate max possible
  const maxPossible = results.reduce((sum, _, index) => {
    return sum + player.questionValue + index * player.valueIncrement;
  }, 0);

  const getMessage = () => {
    if (percentage === 100) return 'PERFECT! Ești un adevărat milionar!';
    if (percentage >= 90) return 'Excelent! Aproape perfect!';
    if (percentage >= 70) return 'Foarte bine! Ai multe cunoștințe!';
    if (percentage >= 50) return 'Bine! Mai exersează!';
    return 'Nu renunța! Încearcă din nou la anul!';
  };

  return (
    <div className="summary">
      {/* Left Panel - Money Hero */}
      <div className="summary-hero">
        <div className="hero-header">
          <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" className="hero-logo" />
          <div className="hero-player">
            <span className="hero-label">Câștigător</span>
            <span className="hero-name">{player.name}</span>
          </div>
        </div>

        <div className="money-showcase">
          <div className="money-glow"></div>
          <div className="money-amount">
            <span className="amount">{totalWon.toFixed(totalWon % 1 === 0 ? 0 : 1)}</span>
            <span className="currency">RON</span>
          </div>
          <div className="money-label">Total câștigat</div>
          <div className="money-max">din {maxPossible.toFixed(maxPossible % 1 === 0 ? 0 : 1)} RON posibil</div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-value correct">{correctCount}</span>
            <span className="stat-label">Corecte</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value incorrect">{totalQuestions - correctCount}</span>
            <span className="stat-label">Greșite</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Scor</span>
          </div>
        </div>

        <p className="hero-message">{getMessage()}</p>
      </div>

      {/* Right Panel - Results List */}
      <div className="summary-results">
        <h2 className="results-header">Rezumat întrebări</h2>
        <div className="results-scroll">
          {results.map((result, index) => {
            const questionValue = player.questionValue + index * player.valueIncrement;
            return (
              <div key={index} className={`result-card ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="card-left">
                  <span className="card-number">{index + 1}</span>
                  {result.question.imageName && (
                    <div className="card-thumb">
                      <img src={`/images/${result.question.imageName}`} alt="" />
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <p className="card-question">{result.question.question}</p>
                  <div className="card-answers">
                    <span className="answer-yours">Tu: {result.selectedAnswer}</span>
                    {!result.isCorrect && <span className="answer-correct">Corect: {result.question.correctAnswer}</span>}
                  </div>
                </div>
                <div className="card-right">
                  <span className={`card-value ${result.isCorrect ? 'won' : 'lost'}`}>
                    {result.isCorrect ? '+' : ''}{questionValue.toFixed(questionValue % 1 === 0 ? 0 : 1)}
                  </span>
                  <span className={`card-icon ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                    {result.isCorrect ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Summary;
