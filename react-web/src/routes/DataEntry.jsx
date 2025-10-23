import {useState} from "react";

export default function DataEntry() {

    const [dateTime, setDateTime] = useState('');
    const [homeTeam, setHomeTeam] = useState('Default Team');
    const [homeScore, setHomeScore] = useState(0);
    const [awayTeam, setAwayTeam] = useState('Default Team');
    const [awayScore, setAwayScore] = useState(0);

    const handleClear = () => {
        setDateTime('');
        setHomeTeam('Default Team');
        setHomeScore(0);
        setAwayTeam('Default Team');
        setAwayScore(0);
    };

    // Handles the sending of data to the API to be saved into the database
    const handleSave = () => {

        fetch(`${import.meta.env.API_BASE_URL}/games/add`, {
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
                if (data.error) {
                    throw new Error("Unexpected Error from Server")
                }
                if (data.id)
                {
                    alert(`Game ${data.id} Information Saved`);
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
                />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Home Team
                </h2>
                <div className="flex gap-8">
                    <div className="flex-1">
                        <label className="block mb-3">
                            Name
                        </label>
                        <select
                            value={homeTeam}
                            onChange={(e) => setHomeTeam(e.target.value)}
                        >
                            <option>Default Team</option>
                            <option>Team One</option>
                            <option>Team Two</option>
                            <option>Team Three</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block mb-3">
                            Score
                        </label>
                        <input
                            type="number"
                            value={homeScore}
                            onChange={(e) => setHomeScore(parseInt(e.target.value))}
                            placeholder={0}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Away Team
                </h2>
                <div className="flex gap-8">
                    <div className="flex-1">
                        <label className="block mb-3">
                            Name
                        </label>
                        <select
                            value={awayTeam}
                            onChange={(e) => setAwayTeam(e.target.value)}
                        >
                            <option>Default Team</option>
                            <option>Team One</option>
                            <option>Team Two</option>
                            <option>Team Three</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block mb-3">
                            Score
                        </label>
                        <input
                            type="number"
                            value={awayScore}
                            onChange={(e) => setAwayScore(parseInt(e.target.value))}
                            placeholder={0}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-6 justify-center">
                <button onClick={handleSave}>
                    SAVE GAME
                </button>
                <button onClick={handleClear}>
                    CLEAR
                </button>
            </div>
        </div>
    )
}
