

export default function Team({team}) {
    return (
        <div className="team-card">
            {team.logoFName && (
                <img src={`/public/uploads/${team.logoFName}`} alt={`${team.name}-logo`}
                className="team-logo"/>
            )}
            <h3 className="team-name">{team.name}</h3>
            <div className="team-stats">
            {team.avgPoints !== undefined && (
                <div className="team-stat">
                    <p className="team-stat-label">AVG POINTS</p>
                    <p className="team-stat-value">{team.avgPoints}</p>
                </div>
            )}
            {team.avgDiff !== undefined && (
                <div className="team-stat">
                    <p className="team-stat-label">AVG DIFF</p>
                    <p className="team-stat-value">{team.avgDiff}</p>
                </div>
            )}
            {team.winRate !== undefined && (
                <div className="team-stat">
                    <p className="team-stat-label">WIN RATE</p>
                    <p className="team-stat-value">{(team.winRate * 100).toFixed(1)}%</p>
                </div>
            )}
            </div>
        </div>
    )
}