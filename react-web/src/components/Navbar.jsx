import {useState} from "react";

export default function Navbar({showLogin, setShowLogin, showDataEntry}) {

    const handleLogin = () => {
        setShowLogin(true);
        return showLogin;
    }

    return (
        <div className="p-4 bg-[#0000ff]">
            <h1>NBA GAME TRACKER - </h1>
            <nav className="flex justify-between">
                <a href="/" className="bg-[#ff0000] text-white">HOME</a>
                <a href="/stats" className="bg-[#ff0000] text-white">STATS</a>
                {showDataEntry && (
                    <a href="/data-entry" className="bg-[#ff0000] text-white">DATA ENTRY</a>
                )}
                <button type="button" onClick={handleLogin} className="bg-[#ff0000] text-white">LOGIN</button>
            </nav>
            <div id="login-container"></div>
        </div>
    )
}