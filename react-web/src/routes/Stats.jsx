import List from "../components/List.jsx";
import { useState } from "react";

/**
 * Page used to display all games and teams with their relevant stats
 * @returns {JSX.Element} The page for displaying lists of all games and all teams
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Stats() {
    const [showGames, setShowGames] = useState(true);
    const [showTeams, setShowTeams] = useState(true);

    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="list-section">
                <div
                    className="list-header-collapsible"
                    onClick={() => setShowGames(!showGames)}
                >
                    <span>GAMES</span>
                    <span className="collapse-icon">{showGames ? '▼' : '▶'}</span>
                </div>
                {showGames && <List sectionName="GAMES"/>}
            </div>

            <div className="list-section">
                <div
                    className="list-header-collapsible"
                    onClick={() => setShowTeams(!showTeams)}
                >
                    <span>TEAMS</span>
                    <span className="collapse-icon">{showTeams ? '▼' : '▶'}</span>
                </div>
                {showTeams && <List sectionName="TEAMS"/>}
            </div>
        </div>
    )
}