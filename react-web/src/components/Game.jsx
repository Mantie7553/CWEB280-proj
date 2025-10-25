
export default function Game({game}) {

    const awayTeam = game.awayTeam;
    const homeTeam = game.homeTeam;

    const includesStats = homeTeam.winRate !== undefined || awayTeam.winRate !== undefined;

    return (
        <>
            <div id="basics">
                {awayTeam.logoFName && (
                    <img src={awayTeam.logoFName} alt={`${awayTeam.name}-logo`}/>
                )}
                <div>
                    <h3>AWAY</h3>
                    <p>{awayTeam.name}</p>
                </div>
                {game.awayScore !== 0 && (
                    <div>
                        <h3>SCORE</h3>
                        <p>{game.awayScore}</p>
                    </div>
                )}
                <div>
                    <p>{game.gameDate}</p>
                    <p>AT</p>
                </div>
                <div>
                    <h3>HOME</h3>
                    <p>{homeTeam.name}</p>
                </div>
                {game.homeScore !== 0 && (
                    <div>
                        <h3>SCORE</h3>
                        <p>{game.homeScore}</p>
                    </div>
                )}
                {homeTeam.logoFName && (
                    <img src={homeTeam.logoFName} alt={`${homeTeam.name}-logo`}/>
                )}
            </div>
            {includesStats && (
                <div id="stats">
                    <div>
                        <h3>WIN RATE</h3>
                        <p>{homeTeam.winRate}</p>
                    </div>
                    <div>
                        <h3>AVG POINTS</h3>
                        <p>{homeTeam.avgPoints}</p>
                    </div>
                    <div>
                        <h3>AVG DIFF</h3>
                        <p>{homeTeam.avgDiff}</p>
                    </div>
                    <div>
                        <h3>WIN RATE</h3>
                        <p>{awayTeam.winRate}</p>
                    </div>
                    <div>
                        <h3>AVG POINTS</h3>
                        <p>{awayTeam.avgPoints}</p>
                    </div>
                    <div>
                        <h3>AVG DIFF</h3>
                        <p>{awayTeam.avgDiff}</p>
                    </div>
                </div>
            )}
        </>
    )
}
