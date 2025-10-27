import {useState, useEffect, use} from "react";
import TeamAdd from "../components/TeamAdd.jsx";

export default function DataEntry() {
    const [showModal, setShowModal] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [homeTeam, setHomeTeam] = useState('');
    const [homeTeamId, setHomeTeamId] = useState(null);
    const [homeScore, setHomeScore] = useState(0);
    const [awayTeam, setAwayTeam] = useState('');
    const [awayTeamId, setAwayTeamId] = useState(null);
    const [awayScore, setAwayScore] = useState(0);
    const [teamArray, setTeamArray] = useState([]);
    // Fetch teams from API
    useEffect(() => {
        fetchTeams();
    }, []);

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

    const handleTeamAdded = (newTeam) => {
        fetchTeams();
    };

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

    const handleClear = () => {
        setDateTime('');
        setHomeTeam('Default Team');
        setHomeScore(0);
        setAwayTeam('Default Team');
        setAwayScore(0);
    };

    // Handles the sending of data to the API to be saved into the database
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


        fetch(`${import.meta.env.VITE_API_BASE_URL}/game/add`, {
            method: 'POST',
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
                    alert(`Game ${data.id} Information Saved\n
                    ${data.awayTeam} AT ${data.homeTeam}`);
                    handleClear();
                }
            })
            .catch(err => {
                alert("Unable to upload game\n" + err);
            })
    }

    return (
        <div className="data-entry-container">

            <div className="data-entry-datetime">
                <label className="data-entry-label">
                    Date
                </label>
                <input
                    type="date"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="data-entry-input"
                    required
                />
            </div>

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
                                    <button type="button" onClick={() => setShowModal(true)}
                                    className="btn-link">
                                        Don't see the team you need? Add one
                                    </button>
                                </div>

                                <div className="data-entry-field">
                                    <label className="data-entry-label">
                                        Score
                                    </label>
                                    <input
                                        type="number"
                                        value={section.score}
                                        className="data-entry-input"
                                        onChange={(e) => section.setScore(parseInt(e.target.value))}
                                        placeholder={"0"}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )
            })}

            <div className="flex gap-6 justify-center">
                <button onClick={handleSave} className="btn-primary">
                    SAVE GAME
                </button>
                <button onClick={handleClear} className="btn-secondary">
                    CLEAR
                </button>
            </div>

            <TeamAdd
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleTeamAdded}
            />
        </div>
    )
}
