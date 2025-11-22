/**
 * A React component used as a placeholder in any case where there is no actual team data to show
 * @returns {JSX.Element} displaying an empty team object
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function EmptyTeam() {
    return (
        <div className="team-card opacity-30">
            <div className="team-logo"></div>
            <div className="team-name">---</div>
            <div className="team-stats">
                <div className="team-stat">
                    <div className="team-stat-label">AVG POINTS</div>
                    <div className="team-stat-value">---</div>
                </div>
                <div className="team-stat">
                    <div className="team-stat-label">AVG DIFF</div>
                    <div className="team-stat-value">---</div>
                </div>
                <div className="team-stat">
                    <div className="team-stat-label">WIN RATE</div>
                    <div className="team-stat-value">---</div>
                </div>
            </div>
        </div>
    )
}