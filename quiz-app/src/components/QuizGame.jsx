import { useState, useEffect, useMemo } from 'react';
import './QuizGame.css';
import { playCorrectSound, playWrongSound, playSuspenseSound, stopSuspenseSound } from '../utils/sounds';

const WITH_ANIMATIONS = false;

function QuizGame({ player, questions, onComplete, savedIndex, savedResults, onIndexChange, onResultsChange }) {
  const [currentIndex, setCurrentIndex] = useState(savedIndex || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState(savedResults || []);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [questionVisible, setQuestionVisible] = useState(!WITH_ANIMATIONS);

  const currentQuestion = questions[currentIndex];
  const optionKeys = useMemo(() => {
    return Object.keys(currentQuestion?.options || {}).sort();
  }, [currentQuestion]);
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const totalQuestions = questions.length;
  const hasImage = !!currentQuestion?.imageName;
  const questionValue = player.questionValue + currentIndex * player.valueIncrement;

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

  // Show question text with 2s delay
  useEffect(() => {
    if (!WITH_ANIMATIONS) return;

    setQuestionVisible(false);
    const timer = setTimeout(() => {
      setQuestionVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Show options with delay - 3 seconds wait, then one by one
  useEffect(() => {
    if (!currentQuestion) return;

    if (!WITH_ANIMATIONS) {
      setVisibleOptions(optionKeys);
      return;
    }

    setVisibleOptions([]);

    const timers = [];
    const initialDelay = setTimeout(() => {
      optionKeys.forEach((key, index) => {
        const timer = setTimeout(() => {
          setVisibleOptions((prev) => [...prev, key]);
        }, index * 2000); // 2s between each option
        timers.push(timer);
      });
    }, 7000); // 2 seconds initial delay

    timers.push(initialDelay);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentQuestion, optionKeys]);

  const allOptionsVisible = visibleOptions.length === optionKeys.length;

  const handleAnswerClick = (answerKey) => {
    if (showResult || !allOptionsVisible) return;

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
      questionValue: questionValue,
      selectedAnswer: answerKey,
      isCorrect: isAnswerCorrect,
    };

    // Replace if result for this question ID already exists, otherwise append
    const existingIndex = results.findIndex(r => r.question.id === currentQuestion.id);
    if (existingIndex >= 0) {
      const newResults = [...results];
      newResults[existingIndex] = result;
      setResults(newResults);
    } else {
      setResults([...results, result]);
    }
  };

  const handleRetry = () => {
    if (!showResult) return;
    // Remove the result for current question
    setResults(results.filter(r => r.question.id !== currentQuestion.id));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      onComplete([...results]);
    } else {
      setQuestionVisible(false);
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

  return (
    <div className="quiz-game">
      <div className="game-header">
        <div className="header-left">
          <div className="header-logo">
            <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" />
          </div>
          <div className="header-player">
            <span className="player-label">Jucător:</span>
            <span className="player-name">{player.name}</span>
          </div>
        </div>

        <div className="progress-info">
          <span className="question-counter">
            Întrebarea {currentIndex + 1} din {totalQuestions}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
          </div>
          <span className="subject-text">{currentQuestion.subject}</span>
        </div>

        <div className="header-right">
          <div className="question-value">
            <span className="value-label">Valoare întrebare:</span>
            <span className="value-amount">{questionValue.toFixed(questionValue % 1 === 0 ? 0 : 1)} RON</span>
          </div>
        </div>
      </div>

      <div className={`question-area ${hasImage ? 'has-image' : 'no-image'}`}>

        <p className={`question-text ${hasImage ? '' : 'large'} ${questionVisible ? 'visible' : 'hidden'}`}>{currentQuestion.question}</p>

        {hasImage && (
          <div className={`question-image-container ${showResult ? 'compact' : ''} ${questionVisible ? 'visible' : 'hidden'}`}>
            <img src={`/images/${currentQuestion.imageName}`} alt="Imagine întrebare" className="question-image" />
          </div>
        )}
      </div>

      <div className={`options-grid ${optionKeys.length > 4 ? 'six-options' : ''} ${showResult ? 'compact' : ''}`}>
        {optionKeys.map((key) => (
          <button
            key={key}
            className={`${getOptionClass(key)} ${visibleOptions.includes(key) ? 'visible' : 'hidden'}`}
            onClick={() => handleAnswerClick(key)}
            disabled={showResult || !allOptionsVisible}
          >
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
