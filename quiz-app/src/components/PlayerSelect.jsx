import './PlayerSelect.css';

function PlayerSelect({ players, onSelect }) {
  return (
    <div className="player-select">
      <div className="logo-container">
        <img src="/images/milionar-logo.png" alt="Vrei să fii milionar?" className="logo" />
      </div>

      <h1 className="title">Vrei să fii milionar?</h1>
      <p className="subtitle">Selectează jucătorul</p>

      <div className="players-grid">
        {players.map(player => (
          <button
            key={player.id}
            className="player-button"
            onClick={() => onSelect(player)}
          >
            <span className="player-name">{player.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlayerSelect
