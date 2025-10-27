import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";
import Game from "./Game.jsx";
import EmptyGame from "./EmptyGame.jsx";
import EmptyTeam from "./EmptyTeam.jsx";


export default function List({sectionName}) {

    const[info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const gameOrTeam = sectionName === "TOP TEAMS" || sectionName === "TEAMS" ? 'team' : 'game';

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
            <div className={sectionName === 'team' ? 'list-section-team' : 'list-section-game'}>
                <h2 className="list-header">{sectionName}</h2>
                <div className="loading-container">
                    <div>Loading...</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => (
                    sectionName === 'TOP TEAMS' || sectionName === 'TEAMS'
                    ? <EmptyTeam key={`empty-${index}`}/>
                    : <EmptyGame key={`empty-${index}`}/>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={sectionName === 'team' ? 'list-section-team' : 'list-section-game'}>
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
            <div className={sectionName === 'team' ? 'list-section-team' : 'list-section-game'}>
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
        <div className={gameOrTeam === 'team' ? 'list-section-team' : 'list-section-game'}>
            <h2 className="list-header">{sectionName}</h2>
            {info.map((item, index) => {
                if (!item) {
                    if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                        return (
                            <EmptyTeam/>
                        );
                    } else {
                        return (
                            <EmptyGame/>
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