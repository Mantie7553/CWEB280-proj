import List from "../components/list-parts/List.jsx";

/**
 * Home page that displays three lists for the:
 *  - top teams (limited to 5) - sorted by win rate
 *  - upcoming games (limited to 5)
 *  - recent games (limited to 5)
 * @returns {JSX.Element}
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Home() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <List sectionName="TOP TEAMS"/>
            <div className="flex flex-col gap-6">
                <List sectionName="UPCOMING"/>
                <List sectionName="RECENT"/>
            </div>
        </div>
    )

}
