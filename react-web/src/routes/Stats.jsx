import List from "../components/List.jsx";

/**
 * Page used to display all games and teams with their relevant stats
 * @returns {JSX.Element} The page for displaying lists of all games and all teams
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Stats() {

    return (
        <div className="grid grid-cols-1 gap-2">
            <List sectionName="GAMES"/>
            <List sectionName="TEAMS"/>
        </div>
    )
}