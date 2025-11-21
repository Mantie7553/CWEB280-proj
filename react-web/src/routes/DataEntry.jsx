import {useState, useEffect} from "react";
import TeamAdd from "../components/modals/TeamAdd.jsx";
import DateInput from "../components/form-parts/DateInput.jsx";
import Button from "../components/form-parts/Button.jsx";
import CreateSeries from "../components/modals/CreateSeries.jsx";
import {useLocation, useNavigate} from "react-router-dom";

/**
 * Creates the Data Entry page, used to enter new data into the database
 * @returns {JSX.Element} The page for entering new data
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function DataEntry() {
    const location = useLocation();
    const navigate = useNavigate();

    const [showTeamAdd, setShowTeamAdd] = useState(false);
    const [showCreateSeries, setShowCreateSeries] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [homeTeam, setHomeTeam] = useState('');
    const [homeTeamId, setHomeTeamId] = useState(null);
    const [homeScore, setHomeScore] = useState(0);
    const [awayTeam, setAwayTeam] = useState('');
    const [awayTeamId, setAwayTeamId] = useState(null);
    const [awayScore, setAwayScore] = useState(0);
    const [teamArray, setTeamArray] = useState([]);
    const [editingGameId, setEditingGameId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    /**
     * calls the fetch Teams functions when the page is loaded
     */
    useEffect(() => {
        fetchTeams();
    }, []);

    /**
     * Check for edit data passed through navigation
     */
    useEffect(() => {
        if (location.state?.editGame) {
            const game = location.state.editGame;
            loadGameToEdit(game);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    /**
     * Fetches teams from the database to be used
     * in the teams select list to limit user error when entering a team
     *  sets the team array to the response from the fetch
     * @returns {Promise<void>}
     */
    const fetchTeams = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/team`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                setTeamArray(data);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    /**
     * When a new team is added, updates the list of teams in the select
     */
    const handleTeamAdded = () => {
        fetchTeams();
    };

    /**
     * Load a game for editing
     * @param {Object} game - The game object to edit
     */
    const loadGameToEdit = (game) => {
        setEditingGameId(game.id);
        setIsEditMode(true);
        setDateTime(game.dateTime || game.gameDate);
        setHomeTeamId(game.homeTeam.id);
        setHomeTeam(game.homeTeam.name);
        setHomeScore(game.homeScore);
        setAwayTeamId(game.awayTeam.id);
        setAwayTeam(game.awayTeam.name);
        setAwayScore(game.awayScore);
    };

    /**
     * The two sections of data to be entered (home and away)
     * @type {[{teamName: string, setTeamId: (value: unknown) => void, setTeamName:
     * (value: (((prevState: string) => string) | string)) => void, score: number, teams: *[], teamId: unknown,
     * title: string, setScore: (value: (((prevState: number) => number) | number)) => void},{teamName: string,
     * setTeamId: (value: unknown) => void, setTeamName: (value: (((prevState: string) => string) | string)) => void,
     * score: number, teams: *[], teamId: unknown, title: string, setScore: (value: (((prevState: number) => number) | number)) => void}]}
     */
    const sections = [
        {
            title:"Home Team",
            teamId: homeTeamId,
            setTeamId: setHomeTeamId,
            teamName: homeTeam,
            setTeamName: setHomeTeam,
            score: homeScore,
            setScore: setHomeScore,
            teams:teamArray
        },
        {
            title:"Away Team",
            teamId: awayTeamId,
            setTeamId: setAwayTeamId,
            teamName: awayTeam,
            setTeamName: setAwayTeam,
            score: awayScore,
            setScore: setAwayScore,
            teams:teamArray
        }
    ];

    /**
     * Sets all values back to their defaults
     */
    const handleClear = () => {
        setDateTime('');
        setHomeTeam('Default Team');
        setHomeScore(0);
        setAwayTeam('Default Team');
        setAwayScore(0);
        setEditingGameId(null);
        setIsEditMode(false);
    };

    /**
     * Alerts a user when data has not been entered
     *  else posts the new data to the database
     */
    const handleSave = () => {
        if (!dateTime) {
            alert('Please select a date and time');
            return;
        }
        if (!homeTeamId) {
            alert('Please select a home team');
            return;
        }
        if (!awayTeamId) {
            alert('Please select an away team');
            return;
        }

        const gameData = {
            dateTime,
            homeTeam: homeTeamId,
            homeScore: homeScore || 0,
            awayTeam: awayTeamId,
            awayScore: awayScore || 0
        };

        const url = isEditMode
            ? `${import.meta.env.VITE_API_BASE_URL}/game/update/${editingGameId}`
            : `${import.meta.env.VITE_API_BASE_URL}/game/add`;

        const method = isEditMode ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(gameData)
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Unknown Error");
                }
                return resp.json();
            })
            .then(data => {
                if(data.error) {
                    throw new Error(data.error)
                }
                if (data.id)
                {
                    const action = isEditMode ? 'Updated' : 'Saved'
                    alert(`Game ${data.id} Information ${action}\n
                    ${data.awayTeam} AT ${data.homeTeam}`);
                    handleClear();
                }
            })
            .catch(err => {
                alert(`Unable to ${isEditMode ? 'update' : 'upload'} game` + err.message);
            })
    }

    /**
     * Delete the current game
     */
    const handleDelete = () => {
        if (!editingGameId) {
            alert('No game selected to delete');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this game?')) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/game/delete/${editingGameId}`, {method: 'DELETE'})
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.error);
                }
            })
            .then(data => {
                alert('Game deleted successfully');
                handleClear();
            })
            .catch(err => {
                alert('Unable to delete game\n' + err.message);
            })
    };

    return (
        <div className="data-entry-page">
            <div className="data-entry-container">
                <div className="border">
                    {isEditMode && (
                        <div>
                            <h3>Editing Game #{editingGameId}</h3>
                            <Button onClick={handleClear} className="btn-primary" text="Cancel Edit / Create"/>
                        </div>
                    )}
                    <DateInput label="Date" dateTime={dateTime} setDateTime={setDateTime} />
                    {/* map here to cut down on the amount of duplicate code */}
                    {sections.map((section, index) => {
                        return (
                            <div key={index} className="data-entry-section">
                                <h2 className="data-entry-section-title">
                                    {section.title}
                                </h2>
                                <div className="data-entry-fields">
                                    <div className="data-entry-field">
                                        <label className="data-entry-label">
                                            Name
                                        </label>
                                        <select
                                            value={section.teamId || ''}
                                            className="data-entry-input"
                                            onChange={(e) => {
                                                const selectedId = parseInt(e.target.value);
                                                const selectedTeam = section.teams.find(t => t.id === selectedId);
                                                section.setTeamId(selectedId);
                                                section.setTeamName(selectedTeam?.name || '');
                                            }}
                                            required
                                        >
                                            <option value="">Select a team</option>
                                            {section.teams && section.teams.length > 0 ? (
                                                section.teams.map(team => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Loading teams...</option>
                                            )}
                                        </select>
                                        <Button onClick={() => setShowTeamAdd(true)}
                                                className="btn-link" text="Don't see the team you need? Add one"/>
                                    </div>

                                    <div className="data-entry-field">
                                        <label className="data-entry-label">
                                            Score
                                        </label>
                                        <input
                                            type="number"
                                            value={section.score}
                                            className="data-entry-input"
                                            onChange={(e) => section.setScore(parseInt(e.target.value) || 0)}
                                            placeholder={"0"}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className="flex gap-6 justify-center">
                        <Button
                            onClick={handleSave}
                            className="btn-primary"
                            text={isEditMode ? "UPDATE GAME" : "SAVE GAME"}
                        />
                        {isEditMode && (
                            <Button onClick={handleDelete} className="btn-secondary" text="DELETE GAME"/>
                        )}
                        <Button onClick={handleClear} className="btn-secondary" text="CLEAR"/>
                    </div>
                    {/* modal for adding a team */}
                    <TeamAdd
                        isOpen={showTeamAdd}
                        onClose={() => setShowTeamAdd(false)}
                        onSuccess={handleTeamAdded}
                    />
                </div>
            </div>
            <Button
                onClick={() => setShowCreateSeries(true)}
                className="btn-primary"
                text="CREATE SERIES"
            />
            <CreateSeries isOpen={showCreateSeries} onClose={() =>setShowCreateSeries(false)} />
        </div>
    )
}
