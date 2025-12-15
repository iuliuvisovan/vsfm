import { useState, useEffect } from 'react'
import PlayerSelect from './components/PlayerSelect'
import ReadyScreen from './components/ReadyScreen'
import QuizGame from './components/QuizGame'
import Summary from './components/Summary'
import petrutaQuestions from './questions/questions-petruta.json'
import leoQuestions from './questions/questions-leo.json'
import iustinQuestions from './questions/questions-iustin.json'
import { enableSounds, playBeforeSound, playSuspenseSound, stopAllSounds } from './utils/sounds'
import './App.css'

const STORAGE_KEY = 'vsfm-quiz-state'

function App() {
  const [gameState, setGameState] = useState('select')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [results, setResults] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const handleToggleSound = () => {
    if (soundEnabled) {
      stopAllSounds()
      setSoundEnabled(false)
    } else {
      enableSounds()
      setSoundEnabled(true)
      // Play appropriate sound based on current game state
      if (gameState === 'select' || gameState === 'ready') {
        playBeforeSound()
      } else if (gameState === 'playing') {
        playSuspenseSound()
      }
    }
  }

  const players = [
    { id: 'petruta', name: 'Petruța', questionValue: 5, valueIncrement: 0.5 },
    { id: 'leo', name: 'Leo', questionValue: 3, valueIncrement: 0.5 },
    { id: 'iustin', name: 'Iustin', questionValue: 5, valueIncrement: 0 }
  ]

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.gameState) setGameState(state.gameState)
        if (state.selectedPlayer) setSelectedPlayer(state.selectedPlayer)
        if (state.results) setResults(state.results)
        if (state.currentIndex !== undefined) setCurrentIndex(state.currentIndex)
      } catch (e) {
        console.error('Failed to load saved state:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return
    const state = {
      gameState,
      selectedPlayer,
      results,
      currentIndex
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [gameState, selectedPlayer, results, currentIndex, isLoaded])

  const questionsByTarget = {
    petruta: petrutaQuestions.questions,
    leo: leoQuestions.questions,
    iustin: iustinQuestions.questions
  }

  const getPlayerQuestions = (playerId) => {
    const list = questionsByTarget[playerId] || []
    return [...list].sort((a, b) => a.difficulty - b.difficulty)
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    setResults([])
    setCurrentIndex(0)
    setGameState('ready')
  }

  const handleStartGame = () => {
    setGameState('playing')
  }

  const handleGameComplete = (gameResults) => {
    setResults(gameResults)
    setGameState('summary')
  }

  const handleRestart = () => {
    setSelectedPlayer(null)
    setResults([])
    setCurrentIndex(0)
    setGameState('select')
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    handleRestart()
  }

  const handleIndexChange = (index) => {
    setCurrentIndex(index)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <div className="app">
      <div className="app-container">
        {gameState === 'select' && (
          <PlayerSelect
            players={players}
            onSelect={handlePlayerSelect}
          />
        )}

        {gameState === 'ready' && selectedPlayer && (
          <ReadyScreen
            player={selectedPlayer}
            questionCount={getPlayerQuestions(selectedPlayer.id).length}
            onStart={handleStartGame}
          />
        )}

        {gameState === 'playing' && selectedPlayer && (
          <QuizGame
            player={selectedPlayer}
            questions={getPlayerQuestions(selectedPlayer.id)}
            onComplete={handleGameComplete}
            savedIndex={currentIndex}
            savedResults={results}
            onIndexChange={handleIndexChange}
            onResultsChange={setResults}
          />
        )}

        {gameState === 'summary' && (
          <Summary
            player={selectedPlayer}
            results={results}
            onRestart={handleRestart}
          />
        )}

        {gameState !== 'select' && (
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        )}

        <button className={`sound-button ${soundEnabled ? 'on' : 'off'}`} onClick={handleToggleSound}>
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  )
}

export default App
