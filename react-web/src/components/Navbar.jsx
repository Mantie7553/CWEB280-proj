import { useEffect, useRef, useState} from "react";

/**
 * Navbar component used to navigate between pages
 *  - shows the login modal when the login button is clicked
 *  - toggles the dropdown on or off, if it is already open or not
 *  - logs the user out if they are logged in
 * @param setShowLogin function called to set the showLogin boolean
 * @param showDataEntry boolean used to hide / show the data entry link
 * @param currentAccount the current account being used
 * @param onLogout the function to call when a user logs out
 * @returns {JSX.Element} the navbar displayed at the top of every page
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Navbar({ setShowLogin, showDataEntry, currentAccount, onLogout}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    /**
     * Function called to show the login modal
     *  so that a user can authenticate
     */
    const handleLogin = () => {
        setShowLogin(true);
    }

    /**
     * Function called to show or hide the account drop down once a user has been logged in
     */
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    /**
     * Function that hides the account dropdown
     *  and calls the onLogout function passed in from App.jsx
     */
    const handleLogout = () => {
        setShowDropdown(false);
        onLogout();
    }

    /**
     * Allows for closing the dropdown when clicking outside the dropdown
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains (e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {document.removeEventListener('mousedown', handleClickOutside)}
    }, []);

    return (
        <div className="navbar">
            <h1 className="navbar-title">NBA GAME TRACKER</h1>
            <nav className="navbar-links">
                <a href="/" className="navbar-link">HOME</a>
                <a href="/stats" className="navbar-link">STATS</a>
                {showDataEntry && (
                    <a href="/data-entry" className="navbar-link">DATA ENTRY</a>
                )}
                {currentAccount ? (
                    <div ref={dropdownRef} className="navbar-account-section">
                            <button type="button" onClick={toggleDropdown}
                                    className="navbar-button navbar-link">
                                ACCOUNT
                            </button>

                        {showDropdown  && (
                            <div className="navbar-dropdown">
                                <button type="button" onClick={handleLogout}
                                        className="navbar-dropdown-button">LOG OUT</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button type="button"
                            onClick={handleLogin} className="navbar-button navbar-link">LOGIN</button>
                )}
            </nav>
            <div id="login-container"></div>
        </div>
    )
}