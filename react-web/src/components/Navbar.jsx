import Login from "./Login.jsx";
import {useState} from "react";

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);

    const handleLogin = () => {
        return (
            <Login
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        )
    }

    return (
        <div className="p-4 bg-[#0000ff]">
            <h1>NBA GAME TRACKER - </h1>
            <nav className="flex justify-between">
                <a href="/" className="bg-[#ff0000] text-white">HOME</a>
                <a href="/stats" className="bg-[#ff0000] text-white">STATS</a>
                <a href="/data-entry" className="bg-[#ff0000] text-white">DATA ENTRY</a>
                <button type="button" onClick={handleLogin} className="bg-[#ff0000] text-white">LOGIN</button>
            </nav>
        </div>
    )
}