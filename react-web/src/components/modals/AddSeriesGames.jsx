import List from "../list-parts/List.jsx";
import Button from "../form-parts/Button.jsx";

export default function AddSeriesGames() {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Add Games</h2>
                <List sectionName="TEAMS"/>
                <Button onClick={() => console.log('Save Clicked')} className="btn-primary" text="SAVE GAMES"/>
                <Button onClick={() => console.log('Cancel Clicked')} className="btn-secondary" text="CANCEL"/>
            </div>
        </div>
    )
}