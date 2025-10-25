import Team from "./Team.jsx";
import Pages from "./Pages.jsx";
import {useEffect, useState} from "react";


export default function List({sectionName}) {

    const[info, setInfo] = useState([]);

    useEffect(() => {
        const fetchList = () => {
            let url = '';
            switch (sectionName)
            {
                case "TOP TEAMS":
                    url = "url for top teams";
                    break;
                case "UPCOMING":
                    url = "url for upcoming games";
                    break;
                case "RECENT":
                    url = "url for recent games";
                    break;
                case "GAMES":
                    url = `${import.meta.env.VITE_API_BASE_URL}/game`;
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
                });
        };

        fetchList()
    }, [sectionName]);

    return (
        <div>
            <h2>{sectionName}</h2>
            {info.map((item, index) => {
                if (sectionName === 'TOP TEAMS' || sectionName === 'TEAMS') {
                    return <Team key={item.id || index} team={item}/>
                } else {
                    return (
                        <div>
                            <p>{item.gameDate}</p>
                            <p>{item.awayTeam?.name || `Team${item.awayTeam}`} AT {item.homeTeam?.name || `Team ${item.homeTeam}`}</p>
                            <p>Score: {item.homeScore} - {item.awayScore}</p>
                        </div>
                    )
                }
            })}
            {/*<Pages/>*/}
        </div>
    )
}