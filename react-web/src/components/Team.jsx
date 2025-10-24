

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
        <>
            <h1>{team.logoFName}</h1>
            <img src={team.logoFName} alt={`${team.name}-logo`}/>
            <h3>AVG POINTS</h3>
            <p>{team.avgPoints}</p>
            <h3>AVG DIFF</h3>
            <p>{team.avgDiff}</p>
            <h3>WIN RATE</h3>
            <p>{team.winRate}</p>
        </>
    )
}