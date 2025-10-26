
export default function Game({game}) {

    const awayTeam = game.awayTeam;
    const homeTeam = game.homeTeam;

    const includesStats = homeTeam.winRate !== undefined || awayTeam.winRate !== undefined;

    return (
        <div className="game-card">
            <div id="basics" className="game-basic-info">
                {awayTeam.logoFName && (
                    <img src={`/public/uploads/${awayTeam.logoFName}`} alt={`${awayTeam.name}-logo`}
                    className="game-team-logo"/>
                )}
                <div className="game-team-info">
                    <h3 className="game-team-label">AWAY</h3>
                    <p className="game-team-name">{awayTeam.name}</p>
                </div>
                {game.awayScore !== 0 && (
                    <div className="game-score">
                        <h3 className="game-score-label">SCORE</h3>
                        <p className="game-score-value">{game.awayScore}</p>
                    </div>
                )}
                <div className="game-datetime">
                    <p className="game-datetime-date">{game.gameDate}</p>
                    <p className="game-datetime-at">AT</p>
                </div>
                <div className="game-team-info">
                    <h3 className="game-team-label">HOME</h3>
                    <p className="game-team-name">{homeTeam.name}</p>
                </div>
                {game.homeScore !== 0 && (
                    <div className="game-score">
                        <h3 className="game-score-label">SCORE</h3>
                        <p className="game-score-value">{game.homeScore}</p>
                    </div>
                )}
                {homeTeam.logoFName && (
                    <img src={`/public/uploads/${homeTeam.logoFName}`} alt={`${homeTeam.name}-logo`}
                         className="game-team-logo"/>
                )}
            </div>
            {includesStats && (
                <div id="stats" className="game-stats-info">
                    <div className="game-stat">
                        <h3 className="game-stat-label">WIN RATE</h3>
                        <p className="game-stat-value">{homeTeam.winRate}</p>
                    </div>
                    <div className="game-stat">
                        <h3 className="game-stat-label">AVG POINTS</h3>
                        <p className="game-stat-value">{homeTeam.avgPoints}</p>
                    </div>
                    <div className="game-stat">
                        <h3 className="game-stat-label">AVG DIFF</h3>
                        <p className="game-stat-value">{homeTeam.avgDiff}</p>
                    </div>
                    <div className="game-stat">
                        <h3 className="game-stat-label">WIN RATE</h3>
                        <p className="game-stat-value">{awayTeam.winRate}</p>
                    </div>
                    <div className="game-stat">
                        <h3 className="game-stat-label">AVG POINTS</h3>
                        <p className="game-stat-value">{awayTeam.avgPoints}</p>
                    </div>
                    <div className="game-stat">
                        <h3 className="game-stat-label">AVG DIFF</h3>
                        <p className="game-stat-value">{awayTeam.avgDiff}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
