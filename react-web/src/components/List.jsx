import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";
import Game from "./Game.jsx";


export default function List({sectionName}) {

    const[info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchList = () => {

            setLoading(true);
            setError(null);

            let url = '';
            switch (sectionName)
            {
                case "TOP TEAMS":
                    url = `${import.meta.env.VITE_API_BASE_URL}/team/top`;
                    break;
                case "UPCOMING":
                    url = `${import.meta.env.VITE_API_BASE_URL}/game/1?filter=upcoming`;
                    break;
                case "RECENT":
                    url = `${import.meta.env.VITE_API_BASE_URL}/game/1?filter=recent`;
                    break;
                case "GAMES":
                    url = `${import.meta.env.VITE_API_BASE_URL}/game/stats/${currentPage}`;
                    break;
                case "TEAMS":
                    url = `${import.meta.env.VITE_API_BASE_URL}/team/stats/${currentPage}`;
                    break;
            }
            fetch(url)
                .then((resp) => {
                    if (!resp.ok)throw new Error("Unknown Error");
                    return resp.json();
                })
                .then((data) => {
                    if (data.teams) {
                        let teams = [...data.teams];
                        if (sectionName === 'TEAMS') {
                            while (teams.length < 5) {
                                teams.push(null);
                            }
                        }
                        setInfo(teams);
                        if (data.pageCount) setTotalPages(data.pageCount);
                        if (data.totalTeams) setTotalItems(data.totalTeams);
                    }
                    else {
                        let games = [...data.games];
                        if (sectionName === 'GAMES') {
                            while (games.length < 5) {
                                games.push(null);
                            }
                        }
                        setInfo(games);
                        if (data.pageCount) setTotalPages(data.pageCount);
                        if (data.totalGames) setTotalItems(data.totalGames);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                    setInfo([]);
                })
        };

        fetchList()
    }, [sectionName, currentPage]);

    if (loading) {
        return (
            <div className="list-section">
                <h2 className="list-header">{sectionName}</h2>
                <div className="loading-container">
                    <div>Loading...</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                            <div key={`placeholder-${index}`} className="py-4 px-6 bg-blue-800">
                                <div></div>
                            </div>
                        )
                })}
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-section">
                <h2 className="list-header">{sectionName}</h2>
                <div className="error-container">
                    <div>Error: {error}</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                        <div key={`placeholder-${index}`} className="empty-container">
                            <div></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    if (info.length === 0) {
        return (
            <div className="list-section">
                <h2 className="list-header">{sectionName}</h2>
                <div className="empty-container">
                    <div>No data available</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                        <div key={`placeholder-${index}`} className="empty-container">
                            <div></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    return (
        <div className='list-section'>
            <h2 className="list-header">{sectionName}</h2>
            {info.map((item, index) => {
                console.log(`Item ${index}:`, item);

                if (!item) {
                    if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                        return (
                            <div key={`placeholder-${index}`} className="team-card" style={{opacity: 0.3}}>
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
                        );
                    } else {
                        return (
                            <div key={`placeholder-${index}`} className="game-card" style={{opacity: 0.3}}>
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
                        );
                    }
                }

                if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                    return <Team key={item.id || index} team={item}/>
                } else {
                    return <Game key={item.id || index} game={item}/>
                }
            })}
            {(sectionName === 'GAMES' || sectionName === 'TEAMS') && (
                <Pages
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    )
}