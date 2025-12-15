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

  const getMessage = () => {
    if (percentage === 100) return 'PERFECT! Ești un adevărat milionar!';
    if (percentage >= 90) return 'Excelent! Aproape perfect!';
    if (percentage >= 70) return 'Foarte bine! Ai multe cunoștințe!';
    if (percentage >= 50) return 'Bine! Mai exersează!';
    return 'Nu renunța! Încearcă din nou!';
  };

  return (
    <div className="summary">
      <div className="summary-logo">
        <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" />
      </div>
      <div className="summary-header">
        <h1 className="summary-title">Rezultate finale</h1>
        <p className="player-name">{player.name}</p>
      </div>

      <div className="total-won">
        <span className="total-won-label">Total câștigat</span>
        <span className="total-won-amount">{totalWon.toFixed(totalWon % 1 === 0 ? 0 : 1)} RON</span>
        <p className="score-message">{getMessage()}</p>
      </div>

      <div className="score-display">
        <span className="score-number">{correctCount}</span>
        <span className="score-divider">/</span>
        <span className="score-total">{totalQuestions}</span>
        <span className="score-label">răspunsuri corecte</span>
      </div>

      <div className="results-list">
        <h2 className="results-title">Rezumat răspunsuri</h2>
        <div className="results-scroll">
          {results.map((result, index) => {
            const questionValue = player.questionValue + index * player.valueIncrement;
            return (
              <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-number">{index + 1}</div>
                {result.question.imageName && (
                  <div className="result-thumb">
                    <img src={`/images/${result.question.imageName}`} alt="Imagine întrebare" />
                  </div>
                )}
                <div className="result-content">
                  <p className="result-question">{result.question.question}</p>
                  <div className="result-answers">
                    <span className={`your-answer ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      Răspunsul tău: {result.selectedAnswer}
                    </span>
                    {!result.isCorrect && <span className="correct-answer">Corect: {result.question.correctAnswer}</span>}
                  </div>
                </div>
                <div className="result-value">{questionValue.toFixed(questionValue % 1 === 0 ? 0 : 1)} RON</div>
                <div className={`result-icon ${result.isCorrect ? 'correct' : 'incorrect'}`}>{result.isCorrect ? '✓' : '✗'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Summary;
