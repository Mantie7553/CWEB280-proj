/**
 * A React component that shows information related to a given game
 *  - displays both teams logos if present
 *  - displays both teams score if they are greater than 0
 *  - displays the date for a game
 *  - optionally lists the following stats for both teams: win rate, average points, and average point differential
 * @param game an object containing attributes related to an NBA game
 * @returns {JSX.Element} displaying information for a given NBA game
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Game({game}) {

    const awayTeam = game.awayTeam;
    const homeTeam = game.homeTeam;

    const includesStats = homeTeam.winRate !== undefined || awayTeam.winRate !== undefined;
    const hasScores = game.awayScore !== 0 || game.homeScore !== 0;

    return (
        <div className="game-card">
            <div id="basics" className={hasScores ? 'game-basic-info' : 'game-basic-info-no-score'}>
                <img
                    src={awayTeam.logoFName ? `/public/uploads/${awayTeam.logoFName}` : '/NBA-Logo.png'}
                    alt={`${awayTeam.name}-logo`}
                    className="game-team-logo"
                />
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
                {game.homeScore !== 0 && (
                    <div className="game-score">
                        <h3 className="game-score-label">SCORE</h3>
                        <p className="game-score-value">{game.homeScore}</p>
                    </div>
                )}
                <div className="game-team-info">
                    <h3 className="game-team-label">HOME</h3>
                    <p className="game-team-name">{homeTeam.name}</p>
                </div>
                <img
                    src={homeTeam.logoFName ? `/public/uploads/${homeTeam.logoFName}` : '/NBA-Logo.png'}
                    alt={`${homeTeam.name}-logo`}
                    className="game-team-logo"
                />
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
