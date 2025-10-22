import { useState } from 'react'
import {BrowserRouter, replace} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <button onClick={simpleFetch} type="button">Click me to confirm connection</button>
        <button onClick={loadTeams} type="button">Click me to load teams</button>
        <button onClick={fetchTeams} type="button">Click me to see teams from the db</button>
    </BrowserRouter>
  )
}

function simpleFetch() {
    fetch('http://localhost:8080')
        .then((resp) => resp.json())
        .then((data) => alert(data.message))
}

function fetchTeams()
{
    fetch('http://localhost:8080/api/teams')
        .then((resp) => resp.json())
        .then((data) => {
            for (const team of data)
            {
                alert(`Team ${team.id}: ${team.name}. ${team.logo}`)
            }
        })
}

function loadTeams()
{
    fetch('http://localhost:8080/api/load')
        .then((resp) => resp.json())
        .then(() => console.log('Loaded'))
}

export default App
