import './Summary.css';

function Summary({ player, results, onRestart }) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'PERFECT! Ești un adevărat milionar!';
    if (percentage >= 80) return 'Excelent! Aproape perfect!';
    if (percentage >= 60) return 'Foarte bine! Ai multe cunoștințe!';
    if (percentage >= 40) return 'Bine! Mai exersează!';
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

      <div className="score-display">
        <div className="score-circle">
          <span className="score-number">{correctCount}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{totalQuestions}</span>
        </div>
        <div className="score-percentage">{percentage}%</div>
        <p className="score-message">{getMessage()}</p>
      </div>

      <div className="results-list">
        <h2 className="results-title">Detalii răspunsuri</h2>
        <div className="results-scroll">
          {results.map((result, index) => (
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
              <div className={`result-icon ${result.isCorrect ? 'correct' : 'incorrect'}`}>{result.isCorrect ? '✓' : '✗'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Summary;
