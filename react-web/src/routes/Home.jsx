import List from "../components/List.jsx";

export default function Home() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <List sectionName="TOP TEAMS"/>
            <div className="flex flex-col gap-6">
                <List sectionName="UPCOMING"/>
                <List sectionName="RECENT"/>
            </div>
        </div>
    )

}
