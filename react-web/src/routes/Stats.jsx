import {useState} from "react";
import List from "../components/List.jsx";

export default function Stats() {

    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 3;
    const totalPages = 5 //TODO (total games / gamesPerPage)

    function fetchGames()
    {
        fetch(import.meta.env)
            .then((resp) => resp.json())
            .then((data) => {
                for (const team of data)
                {
                    alert(`Team ${team.id}: ${team.name}. ${team.logo}`)
                }
            })
    }

    return (
        <div className="grid grid-cols-1 gap-2">
            <List sectionName="GAMES"/>
            <List sectionName="TEAMS"/>
        </div>


    )
}