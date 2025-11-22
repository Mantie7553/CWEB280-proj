import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";
import Game from "./Game.jsx";
import EmptyGame from "./EmptyGame.jsx";
import EmptyTeam from "./EmptyTeam.jsx";
import {useNavigate} from "react-router-dom";
import TeamAdd from "../modals/TeamAdd.jsx";
import CreateSeries from "../modals/CreateSeries.jsx";
import Series from "./Series.jsx";

/**
 * A React component that lists a number of Team or Game objects
 *  - fetches the data necessary for a given list based off of the sectionName
 *  - can display loading, error, or empty list with placeholder items
 *  - pagination for a list is optional (only for TEAMS or GAMES sections)
 * @param sectionName the title / name of the current section
 * @param canSelect
 * @param selectedGames
 * @param setSelectedGames
 * @returns {JSX.Element}
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function List({sectionName, canSelect, selectedGames, setSelectedGames, seriesData, currentAccount}) {
    const navigate = useNavigate();

    const[info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [showSeriesModal, setShowSeriesModal] = useState(false);
    const [editingSeries, setEditingSeries] = useState(null);

    const showHeader = !['GAMES', 'TEAMS', 'SERIES', 'SERIES GAMES'].includes(sectionName);
    const showPagination = ['GAMES', 'TEAMS', 'SERIES'].includes(sectionName);

    /**
     * useEffect to fetch the data for a given list
     * and sets the info array, total page count, current page, and total item count
     */
    useEffect(() => {

        // Return early if we can use the games from a specific series
        if (sectionName === 'SERIES GAMES' && seriesData && seriesData.games) {
            setInfo(seriesData.games);
            setLoading(false);
            setTotalPages(1);
            setTotalItems(seriesData.games.length);
            return;
        }

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
                case "SERIES":
                    url = `${import.meta.env.VITE_API_BASE_URL}/series/${currentPage}`;
                    break;
                case "FEATURED SERIES":
                    url = `${import.meta.env.VITE_API_BASE_URL}/series/1?filter=featured`;
                    break;
                case "SERIES GAMES":
                    return;
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
                    else if (data.series) {
                        let series = [...data.series];
                        if (sectionName === 'SERIES') {
                            while (series.length < 5) {
                                series.push(null);
                            }
                        }
                        if (sectionName === 'FEATURED SERIES') {
                            series = series.slice(0,3);
                        }
                        setInfo(series);
                        if (data.pageCount) setTotalPages(data.pageCount);
                        if (data.totalSeries) setTotalItems(data.totalSeries);
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
    }, [sectionName, currentPage, seriesData]);

    /**
     * Generic re-fetch function
     */
    const fetchData = () => {
        setLoading(true);
        setError(null);

        let url = '';
        if (sectionName === 'TOP TEAMS') {
            url = `${import.meta.env.VITE_API_BASE_URL}/team/top`;
        } else if (sectionName === 'TEAMS') {
            url = `${import.meta.env.VITE_API_BASE_URL}/team/stats/${currentPage}`;
        } else if (sectionName === 'SERIES') {
            url = `${import.meta.env.VITE_API_BASE_URL}/series/${currentPage}`;
        } else if (sectionName === 'FEATURED SERIES') {
            url = `${import.meta.env.VITE_API_BASE_URL}/series/1?filter=featured`;
        }

        if (url) {
            fetch(url)
                .then((resp) => {
                    if (!resp.ok) throw new Error("Unknown Error");
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
                    } else if (data.series) {
                        let series = [...data.series];
                        if (sectionName === 'SERIES') {
                            while (series.length < 5) {
                                series.push(null);
                            }
                        }
                        if (sectionName === 'FEATURED SERIES') {
                            series = series.slice(0, 3);
                        }
                        setInfo(series);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    };

    /**
     * Handles the two types of series clicks
     *  Must be logged in to open the series edit
     *  Clicking a Series in the SERIES list on the stats page will open the edit page
     *  Clicking a Series in the FEATURED SERIES list will open the details page
     * @param seriesId
     */
    const handleSeriesClick = (seriesId) => {
        if (sectionName === 'SERIES') {
            if (!currentAccount) {
                alert('Please log in to edit series');
                return;
            }
            // On SERIES list, clicking opens edit modal
            fetchSeriesForEdit(seriesId);
        } else {
            // FEATURED SERIES navigates to detail page
            navigate(`/series/${seriesId}`);
        }
    }

    /**
     * Handle clicking on a game to edit it
     */
    const handleGameClick = (game) => {
        if (!currentAccount) {
            alert('Please log in to edit games');
            return;
        }
        // Navigate to DataEntry with the game data
        navigate('/data-entry', { state: { editGame: game } });
    }

    /**
     * Handle clicking on a team to edit it
     */
    const handleTeamClick = (team) => {
        if (!currentAccount) {
            alert('Please log in to edit teams');
            return;
        }
        setEditingTeam(team);
        setShowTeamModal(true);
    }

    /**
     * Refresh any team / series list after successful edit
     */
    const onSuccess = () => {
        fetchData();
    };

    /**
     * Fetch series data for editing
     */
    const fetchSeriesForEdit = async (seriesId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/series/detail/${seriesId}`
            );
            const data = await response.json();
            setEditingSeries(data);
            setShowSeriesModal(true);
        } catch (error) {
            console.error('Error fetching series:', error);
            alert('Failed to load series for editing');
        }
    };

    /**
     * Displays a placeholder list while data is being fetched from the database
     */
    if (loading) {
        return (
            <div className={'list-section-team'}>
                {sectionName !== 'GAMES' && sectionName !== 'TEAMS' && sectionName !== 'SERIES' && (
                    <h2 className="list-header">{sectionName}</h2>
                )}                <div className="loading-container">
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

    /**
     * Adds / removes a selected game to the list for adding when used to add
     *  games to a series
     * @param gameId
     */
    const handleGameSelect = (gameId) => {
        if (selectedGames.includes(gameId)) {
            setSelectedGames(selectedGames.filter(id => id !== gameId));
        } else {
            setSelectedGames([...selectedGames, gameId]);
        }
    };

    /**
     *  Displays a list with an error
     */
    if (error) {
        return (
            <div className={'list-section-team'}>
                {sectionName !== 'GAMES' && sectionName !== 'TEAMS' && sectionName !== 'SERIES' && (
                    <h2 className="list-header">{sectionName}</h2>
                )}                <div className="error-container">
                    <div>Error: {error}</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                        return (
                            <EmptyTeam/>
                        );
                    } else {
                        return (
                            <EmptyGame/>
                        );
                    }
                })}
            </div>
        );
    }

    /**
     * Displays an empty list with a message that there is nothing to show
     */
    if (info.length === 0) {
        return (
            <div className={'list-section-team'}>
                {sectionName !== 'GAMES' && sectionName !== 'TEAMS' && sectionName !== 'SERIES' && (
                    <h2 className="list-header">{sectionName}</h2>
                )}
                <div className="empty-container">
                    <div>No data available</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                        return (
                            <EmptyTeam/>
                        );
                    } else {
                        return (
                            <EmptyGame/>
                        );
                    }
                })}
            </div>
        );
    }


    /**
     * Standard return when there is data to display
     *  Any empty positions will be filled with placeholder values
     */
    return (
        <div className={sectionName === 'GAMES'
        || sectionName === 'UPCOMING'
        || sectionName === 'RECENT'
            ? 'list-section-game'
            : 'list-section-team'}>
            {showHeader && (
                <h2 className="list-header">{sectionName}</h2>
            )}
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
                    return <Team
                        key={item.id || index}
                        team={item}
                        clickable={sectionName === 'TEAMS'}
                        onClick={sectionName === 'TEAMS' ? handleTeamClick : undefined}
                    />
                } else  if (sectionName === 'SERIES' || sectionName === 'FEATURED SERIES') {
                    return (
                        <Series
                            series={item}
                            handleSeriesClick={handleSeriesClick}
                        />
                    )
                } else {
                    return <Game
                        key={item.id || index}
                        game={item}
                        canSelect={canSelect}
                        isSelected={selectedGames && selectedGames.includes(item.id)}
                        onSelect={handleGameSelect}
                        clickable={sectionName === 'GAMES' && !canSelect}
                        onClick={sectionName === 'GAMES' && !canSelect ? handleGameClick : undefined}
                    />
                }
            })}
            {showPagination && (
                <Pages
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}

            <TeamAdd
                isOpen={showTeamModal}
                onClose={() => {
                    setShowTeamModal(false);
                    setEditingTeam(null);
                }}
                onSuccess={onSuccess}
                editTeam={editingTeam}
            />

            <CreateSeries
                isOpen={showSeriesModal}
                onClose={() => {
                    setShowSeriesModal(false);
                    setEditingSeries(null);
                }}
                onSuccess={onSuccess}
                editSeries={editingSeries}
            />
        </div>
    )
}