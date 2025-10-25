import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";
import Game from "./Game.jsx";


export default function List({sectionName, colSize}) {

    const[info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    url = `${import.meta.env.VITE_API_BASE_URL}/game/stats/1`;
                    break;
                case "TEAMS":
                    url = `${import.meta.env.VITE_API_BASE_URL}/team/stats`;
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
                    }
                    else {
                        setInfo(data.games);
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
    }, [sectionName]);

    if (loading) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold'>
                <h2>{sectionName}</h2>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold'>
                <h2>{sectionName}</h2>
                <p> Error: {error}</p>
            </div>
        );
    }

    if (info.length === 0) {
        return (
            <div className='bg-red-800 px-4 py-2 font-bold'>
                <h2>{sectionName}</h2>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className='bg-red-800 px-4 py-2 font-bold'>
            <h2>{sectionName}</h2>
            {info.map((item, index) => {
                if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                    return <Team key={item.id || index} team={item}/>
                } else {
                    return <Game key={item.id || index} game={item}/>
                }
            })}
            {/*<Pages/>*/}
        </div>
    )
}