import { useState } from 'react'
import {BrowserRouter, replace, Route, Routes} from "react-router-dom";
import DataEntry from "./routes/DataEntry.jsx";
import Home from "./routes/Home.jsx"
import Stats from "./routes/Stats.jsx"
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoggedIn = () => {
        console.log('Once logged in make data entry visible. Switch to account functionality');
    }

    return (
    <BrowserRouter>
        <Navbar showLogin={showLogin} setShowLogin={setShowLogin}/>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/data-entry" element={<DataEntry/>}/>
        </Routes>
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoggedIn}/>
    </BrowserRouter>
  )
}
