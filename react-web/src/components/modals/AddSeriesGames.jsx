import List from "../list-parts/List.jsx";
import Button from "../form-parts/Button.jsx";
import {useState} from "react";

export default function AddSeriesGames({isOpen, onClose, onSave, seriesId}) {

    const [selectedGames, setSelectedGames] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (selectedGames.length === 0) {
            setError("At least one game must be selected");
            return;
        }
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/series/${seriesId}/games`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameIds: selectedGames
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add games to series');
            }

            const data = await response.json();

            if (onSave) {
                onSave(selectedGames);
            }

            // Reset and close
            setSelectedGames([]);
            setError(null);
            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const handleCancel = () => {
        setSelectedGames([]);
        setError(null);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Add Games to Series</h2>
                {error && (
                    <div className="modal-error">
                        {error}
                    </div>
                )}
                <p className="modal-info">Selected: {selectedGames.length} game(s)</p>
                <div className="modal-scrollable-content">
                    <List sectionName="GAMES" canSelect={true} selectedGames={selectedGames} setSelectedGames={setSelectedGames}/>
                </div>
                <div className="form-buttons">
                    <Button onClick={handleSave} className="btn-primary" text={saving ? "SAVING" : "SAVE GAMES"} disabled={saving}/>
                    <Button onClick={handleCancel} className="btn-secondary" text="CANCEL" disabled={saving}/>
                </div>
            </div>
        </div>
    )
}