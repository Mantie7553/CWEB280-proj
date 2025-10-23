import {useState} from "react";

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
        //TODO show games

        <div>
            {'<< '}
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <span key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                          textDecoration: page === currentPage ? 'underline' : 'none'
                      }}
                >
                    {page}
                </span>
            ))}
            {' >>'}
        </div>
    )
}