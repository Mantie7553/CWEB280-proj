

export default function Team(team) {
    // team =
    //     {
    //         "logoFName": "path/file.png",
    //         "name": "Team Name",
    //         "avgPoints": "95",
    //         "avgDiff": "10.2",
    //         "winRate": "0.55"
    //     }
    return (
        <div>
            {team.logoFName && (
                <img src={team.logoFName} alt={`${team.name}-logo`}/>
            )}
            <h3>{team.name}</h3>
            {team.avgPoints !== undefined && (
                <div>
                    <p>AVG POINTS</p>
                    <p>{team.avgPoints}</p>
                </div>
            )}
            {team.avgDiff !== undefined && (
                <div>
                    <p>AVG DIFF</p>
                    <p>{team.avgDiff}</p>
                </div>
            )}
            {team.winRate !== undefined && (
                <div>
                    <p>WIN RATE</p>
                    <p>{(team.winRate * 100).toFixed(1)}%</p>
                </div>
            )}
        </div>
    )
}