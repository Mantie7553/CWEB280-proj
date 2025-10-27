
export default function EmptyGame() {
    return (
        <div className="game-card opacity-30">
            <div className="game-basic-info">
                <div className="game-team-logo"></div>
                <div className="game-team-info">
                    <h3 className="game-team-label">AWAY</h3>
                    <p className="game-team-name">---</p>
                </div>
                <div className="game-score">
                    <h3 className="game-score-label">SCORE</h3>
                    <p className="game-score-value">---</p>
                </div>
                <div className="game-datetime">
                    <p className="game-datetime-date">----</p>
                    <p className="game-datetime-at">AT</p>
                </div>
                <div className="game-team-info">
                    <h3 className="game-team-label">HOME</h3>
                    <p className="game-team-name">---</p>
                </div>
                <div className="game-score">
                    <h3 className="game-score-label">SCORE</h3>
                    <p className="game-score-value">---</p>
                </div>
                <div className="game-team-logo"></div>
            </div>
            <div className="game-stats-info">
                <div className="game-stat">
                    <h3 className="game-stat-label">WIN RATE</h3>
                    <p className="game-stat-value">---</p>
                </div>
                <div className="game-stat">
                    <h3 className="game-stat-label">AVG POINTS</h3>
                    <p className="game-stat-value">---</p>
                </div>
                <div className="game-stat">
                    <h3 className="game-stat-label">AVG DIFF</h3>
                    <p className="game-stat-value">---</p>
                </div>
                <div className="game-stat">
                    <h3 className="game-stat-label">WIN RATE</h3>
                    <p className="game-stat-value">---</p>
                </div>
                <div className="game-stat">
                    <h3 className="game-stat-label">AVG POINTS</h3>
                    <p className="game-stat-value">---</p>
                </div>
                <div className="game-stat">
                    <h3 className="game-stat-label">AVG DIFF</h3>
                    <p className="game-stat-value">---</p>
                </div>
            </div>
        </div>
    )
}