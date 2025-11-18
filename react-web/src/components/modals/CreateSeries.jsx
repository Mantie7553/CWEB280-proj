import TextInput from "../form-parts/TextInput.jsx";
import {useState} from "react";
import DateInput from "../form-parts/DateInput.jsx";
import Button from "../form-parts/Button.jsx";

export default function CreateSeries({isOpen, onClose, onSuccess, onOpenAddGames}) {
    const [seriesName, setSeriesName] = useState('');
    const [seriesType, setSeriesType] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!seriesName || !seriesType || !description || !startDate || !endDate) {
            setError("All fields are required");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date must be before end date");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/series/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: seriesName,
                        type: seriesType,
                        desc: description,
                        start: startDate,
                        end: endDate,
                        games: []
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create series');
            }

            const data = await response.json();

            // Reset form
            setSeriesName('');
            setSeriesType('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setError(null);

            if (onSuccess) {
                onSuccess(data.seriesId);
            }

            // Optionally open add games modal
            if (onOpenAddGames && data.seriesId) {
                onOpenAddGames(data.seriesId);
            }

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
        setSeriesName('');
        setSeriesType('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setError(null);

        if (onClose) {
            onClose();
        }
    };

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Create Series</h2>
                {error && (
                    <div className="modal-error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <TextInput label="Series Name" value={seriesName} setValue={setSeriesName} />
                    <TextInput label="Series Type" value={seriesType} setValue={setSeriesType} />
                    <DateInput label="Start Date" value={startDate} setDateTime={setStartDate} />
                    <DateInput label="End Date" value={endDate} setDateTime={setEndDate} />
                    <TextInput label="Description" value={description} setValue={setDescription} />
                    <div className="form-buttons">
                        <Button type="submit" className="btn-primary"
                                text={saving ? "SAVING" : "SAVE SERIES"} disabled={saving}/>
                        <Button onClick={() => console.log('Clicked Delete')}
                                className="btn-secondary" text="DELETE SERIES"/>
                        <Button onClick={handleCancel} className="btn-secondary" text="CANCEL"/>
                    </div>
                </form>
            </div>
        </div>
    )
}