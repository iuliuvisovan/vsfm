import { useState } from 'react'
import PlayerSelect from './components/PlayerSelect'
import QuizGame from './components/QuizGame'
import Summary from './components/Summary'
import questionsData from './questions.json'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('select') // 'select', 'playing', 'summary'
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [results, setResults] = useState([])

  const players = [
    { id: 'petruta', name: 'Petruta' },
    { id: 'leo', name: 'Leo' },
    { id: 'iustin', name: 'Iustin' }
  ]

  const getPlayerQuestions = (playerId) => {
    return questionsData.questions
      .filter(q => q.target === playerId)
      .sort((a, b) => a.difficulty - b.difficulty)
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    setResults([])
    setGameState('playing')
  }

  const handleGameComplete = (gameResults) => {
    setResults(gameResults)
    setGameState('summary')
  }

  const handleRestart = () => {
    setSelectedPlayer(null)
    setResults([])
    setGameState('select')
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

        {gameState === 'playing' && selectedPlayer && (
          <QuizGame
            player={selectedPlayer}
            questions={getPlayerQuestions(selectedPlayer.id)}
            onComplete={handleGameComplete}
          />
        )}

        {gameState === 'summary' && (
          <Summary
            player={selectedPlayer}
            results={results}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  )
}

export default App
