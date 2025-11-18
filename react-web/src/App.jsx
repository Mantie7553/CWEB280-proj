import {useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DataEntry from "./routes/DataEntry.jsx";
import Home from "./routes/Home.jsx"
import Stats from "./routes/Stats.jsx"
import Login from "./components/modals/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Series from "./routes/Series.jsx";

/**
 * Handles the routing between pages, and saving and removing account info from the
 * localStorage for login and logout functionality
 * </br> renders the navbar, the current page, and the login modal (when it needs to be visible)
 * @returns {JSX.Element}
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showDataEntry, setShowDataEntry] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);

    /**
     * Saves the current account to a localStorage item or uses the one that is already set
     */
    useEffect(() => {
        const savedAccount = localStorage.getItem('currentAccount');
        if (savedAccount) {
            setCurrentAccount(JSON.parse(savedAccount));
            setShowDataEntry(true);
        }
    }, []);

    /**
     * Sets the current account if the user is logged in
     * shows the data entry link
     * @param accountInfo currently just the users id
     */
    const handleLoggedIn = (accountInfo) => {
        setShowDataEntry(true);
        setCurrentAccount(accountInfo);

        localStorage.setItem('currentAccount', JSON.stringify(accountInfo));
    }

    /**
     * Removes the account information from localStorage
     *  hides the data entry link
     */
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
            <Route path="/series/:seriesId" element={<Series/>}/>
        </Routes>
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoggedIn}/>
    </BrowserRouter>
  )
}
