import {useState} from "react";
import TeamAdd from "../components/TeamAdd.jsx";

export default function DataEntry() {
    const [showModal, setShowModal] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [homeTeam, setHomeTeam] = useState('Default Team');
    const [homeScore, setHomeScore] = useState(0);
    const [awayTeam, setAwayTeam] = useState('Default Team');
    const [awayScore, setAwayScore] = useState(0);
    // will be replaced with actual teams from the database
    const teamArray = ["Default","Toronto Raptors", "Indiana Pacers", "Golden State Warriors"];

    const sections = [
        {
            title:"Home Team",
            team: homeTeam,
            setTeam: setHomeTeam,
            score: homeScore,
            setScore: setHomeScore,
            teams:teamArray
        },
        {
            title:"Away Team",
            team: awayTeam,
            setTeam: setAwayTeam,
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

        fetch(`${import.meta.env.VITE_API_BASE_URL}/game/add`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                dateTime,
                homeTeam,
                homeScore,
                awayTeam,
                awayScore
            })
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
        <div className="p-8">

            <div className="flex items-center justify-between gap-8 mb-8">
                <label className="text-2xl font-bold whitespace-nowrap">
                    Date / Time
                </label>
                <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="flex-1"
                    placeholder={"Date / Time"}
                    required
                />
            </div>

            {sections.map((section, index) => {
                return (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl font-bold text-center mb-8">
                                {section.title}
                            </h2>
                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <label className="block mb-3">
                                        Name
                                    </label>
                                    <select
                                        value={section.team}
                                        onChange={(e) => section.setTeam(e.target.value)}
                                        required
                                    >
                                        {section.teams.map(teamOption => {
                                            return (
                                                    <option key={teamOption}>{teamOption}</option>
                                                )
                                        })}
                                    </select>
                                    <button type="button" onClick={() => setShowModal(true)}>
                                        Don't see the team you need? Add one
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <label className="block mb-3">
                                        Score
                                    </label>
                                    <input
                                        type="number"
                                        value={section.score}
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
                <button onClick={handleSave}>
                    SAVE GAME
                </button>
                <button onClick={handleClear}>
                    CLEAR
                </button>
            </div>

            <TeamAdd
                isOpen={showModal}
                onClose={() => {setShowModal(false)}}
            />
        </div>
    )
}
