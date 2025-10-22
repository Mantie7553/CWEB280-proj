
export default function Navbar() {
    return (
        <div className="p-4 bg-[#0000ff]">
            <h1>NBA GAME TRACKER - </h1>
            <nav className="flex justify-between">
                <a href="/" className="bg-[#ff0000] text-white">HOME</a>
                <a href="/stats" className="bg-[#ff0000] text-white">STATS</a>
                <a href="/data-entry" className="bg-[#ff0000] text-white">DATA ENTRY</a>
                <a href="#" className="bg-[#ff0000] text-white">LOGIN</a>
            </nav>
        </div>
    )
}