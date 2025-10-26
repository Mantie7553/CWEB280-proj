import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";
import Game from "./Game.jsx";


export default function List({sectionName}) {

    const[info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
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
            }
            fetch(url)
                .then((resp) => {
                    if (!resp.ok)throw new Error("Unknown Error");
                    return resp.json();
                })
                .then((data) => {
                    if (data.teams) {
                        setInfo(data.teams);
                        if (data.pageCount) setTotalPages(data.pageCount);
                        if (data.totalTeams) setTotalItems(data.totalTeams);
                    }
                    else {
                        setInfo(data.games);
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
    }, [sectionName, currentPage]);

    if (loading) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold'>
                <h2>{sectionName}</h2>
                <div className="py-4 px-6 bg-blue-800">
                    <div className="h-16">Loading...</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                            <div key={`placeholder-${index}`} className="py-4 px-6 bg-blue-800">
                                <div className="h-32"></div>
                            </div>
                        )
                })}
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold min-h-[500px]'>
                <h2>{sectionName}</h2>
                <div className="py-4 px-6 bg-blue-800">
                    <div className="h-16">Error: {error}</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                        <div key={`placeholder-${index}`} className="py-4 px-6 bg-blue-800">
                            <div className="h-32"></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    if (info.length === 0) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold'>
                <h2>{sectionName}</h2>
                <div className="py-4 px-6 bg-blue-800">
                    <div className="h-16">No data available</div>
                </div>
                {Array.from({length: 4}).map((temp, index) => {
                    return(
                        <div key={`placeholder-${index}`} className="py-4 px-6 bg-blue-800">
                            <div className="h-32"></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    return (
        <div className='bg-red-800 px-4 py-2 font-bold'>
            <h2>{sectionName}</h2>
            {info.map((item, index) => {

                if (!item) {
                    return (
                        <div key={`placeholder-${index}`} className="py-4 px-6 bg-blue-800 min-h-[500px]">
                            <div className="h-32"></div>
                        </div>
                    )
                }

                if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                    return <Team key={item.id || index} team={item}/>
                } else {
                    return <Game key={item.id || index} game={item}/>
                }
            })}
            {(sectionName === 'GAMES' || sectionName === 'TEAMS') && (
                <Pages
                    currentpage={info.page}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    )
}