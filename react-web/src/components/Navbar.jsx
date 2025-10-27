import { useEffect, useRef, useState} from "react";

export default function Navbar({showLogin, setShowLogin, showDataEntry, currentAccount, onLogout}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogin = () => {
        setShowLogin(true);
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        setShowDropdown(false);
        onLogout();
    }

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