import { useState, useEffect } from 'react';
import './QuizGame.css';
import { playCorrectSound, playWrongSound, playSuspenseSound, stopSuspenseSound, playGameStartSound } from '../utils/sounds';

function QuizGame({ player, questions, onComplete, savedIndex, savedResults, onIndexChange, onResultsChange }) {
  const [currentIndex, setCurrentIndex] = useState(savedIndex || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState(savedResults || []);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const totalQuestions = questions.length;
  const hasImage = !!currentQuestion?.imageName;
  const questionValue = player.questionValue + currentIndex * player.valueIncrement;

  // Play game start sound on mount (new game)
  useEffect(() => {
    if (savedIndex === 0 && savedResults?.length === 0) {
      playGameStartSound();
    }
  }, []);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);

  // Play suspense when question starts, stop on unmount
  useEffect(() => {
    if (!showResult) {
      playSuspenseSound();
    }
    return () => stopSuspenseSound();
  }, [currentIndex, showResult]);

  const handleAnswerClick = (answerKey) => {
    if (showResult) return;

    setSelectedAnswer(answerKey);
    setShowResult(true);

    const isAnswerCorrect = answerKey === currentQuestion.correctAnswer;

    // Play sound effect
    if (isAnswerCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    const result = {
      question: currentQuestion,
      selectedAnswer: answerKey,
      isCorrect: isAnswerCorrect,
    };
    setResults([...results, result]);
  };

  const handleRetry = () => {
    if (!showResult) return;
    if (results.length > 0) {
      setResults(results.slice(0, -1));
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      onComplete([...results]);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getOptionClass = (key) => {
    let className = 'option';

    if (showResult) {
      if (key === currentQuestion.correctAnswer) {
        className += ' correct';
      } else if (key === selectedAnswer && !isCorrect) {
        className += ' incorrect';
      }
    } else if (selectedAnswer === key) {
      className += ' selected';
    }

    return className;
  };

  const optionKeys = Object.keys(currentQuestion.options).sort();

  return (
    <div className="quiz-game">
      <div className="game-header">
        <div className="header-player">
          <span className="player-label">Jucător:</span>
          <span className="player-name">{player.name}</span>
        </div>

        <div className="header-logo">
          <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" />
        </div>

        <div className="progress-info">
          <span className="question-counter">
            Întrebarea {currentIndex + 1} din {totalQuestions}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="question-value">
        <span className="value-label">Valoare:</span>
        <span className="value-amount">{questionValue.toFixed(questionValue % 1 === 0 ? 0 : 1)} RON</span>
      </div>

      <div className={`question-area ${hasImage ? 'has-image' : 'no-image'}`}>
        <div className="subject-badge">{currentQuestion.subject}</div>

        <p className={`question-text ${hasImage ? '' : 'large'}`}>{currentQuestion.question}</p>

        {hasImage && (
          <div className={`question-image-container ${showResult ? 'compact' : ''}`}>
            <img src={`/images/${currentQuestion.imageName}`} alt="Imagine întrebare" className="question-image" />
          </div>
        )}
      </div>

      <div className={`options-grid ${optionKeys.length > 4 ? 'six-options' : ''}`}>
        {optionKeys.map((key) => (
          <button key={key} className={getOptionClass(key)} onClick={() => handleAnswerClick(key)} disabled={showResult}>
            <span className="option-letter">{key}</span>
            <span className="option-text">{currentQuestion.options[key]}</span>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="result-area">
          <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'CORECT!' : 'GREȘIT!'}</div>
          {!isCorrect && (
            <div className="correct-answer-info">
              Răspunsul corect: <strong>{currentQuestion.correctAnswer}</strong> - {currentQuestion.options[currentQuestion.correctAnswer]}
            </div>
          )}
          <div className="result-actions">
            <button className="next-button" onClick={handleNext}>
              {currentIndex + 1 >= totalQuestions ? 'Vezi rezultatele' : 'Următoarea întrebare'}
            </button>
            <button className="retry-button" onClick={handleRetry}>
              Reincearcă întrebarea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizGame;
