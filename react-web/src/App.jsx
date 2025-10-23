import { useState } from 'react'
import {BrowserRouter, replace, Route, Routes} from "react-router-dom";
import DataEntry from "./routes/DataEntry.jsx";
import Home from "./routes/Home.jsx"
import Stats from "./routes/Stats.jsx"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/data-entry" element={<DataEntry/>}/>
        </Routes>
    </BrowserRouter>
  )
}
