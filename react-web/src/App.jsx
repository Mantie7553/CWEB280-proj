import {useEffect, useState} from 'react'
import {BrowserRouter, replace, Route, Routes} from "react-router-dom";
import DataEntry from "./routes/DataEntry.jsx";
import Home from "./routes/Home.jsx"
import Stats from "./routes/Stats.jsx"
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showDataEntry, setShowDataEntry] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);

    useEffect(() => {
        const savedAccount = localStorage.getItem('currentAccount');
        if (savedAccount) {
            setCurrentAccount(JSON.parse(savedAccount));
            setShowDataEntry(true);
        }
    }, []);

    const handleLoggedIn = (accountInfo) => {
        setShowDataEntry(true);
        setCurrentAccount(accountInfo);

        localStorage.setItem('currentAccount', JSON.stringify(accountInfo));
    }

    const handleLogout = () => {
        setShowDataEntry(false);
        setCurrentAccount(null);

        localStorage.removeItem('currentAccount');
    }

    return (
    <BrowserRouter>
        <Navbar showLogin={showLogin} setShowLogin={setShowLogin}
                showDataEntry={showDataEntry} setShowDataEntry={setShowDataEntry}
                currentAccount={currentAccount} onLogout={handleLogout}
        />
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/data-entry" element={<DataEntry/>}/>
        </Routes>
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoggedIn}/>
    </BrowserRouter>
  )
}
