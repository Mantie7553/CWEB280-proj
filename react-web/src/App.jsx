import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import {replace} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <button onClick={simpleFetch} type="button">Click me to confirm connection</button>
    </>
  )
}

function simpleFetch() {
    fetch('http://localhost:8080')
        .then((resp) => resp.json())
        .then((data) => alert(data.message))
}

export default App
