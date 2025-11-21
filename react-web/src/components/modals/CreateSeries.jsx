import TextInput from "../form-parts/TextInput.jsx";
import {useEffect, useState} from "react";
import DateInput from "../form-parts/DateInput.jsx";
import Button from "../form-parts/Button.jsx";

export default function CreateSeries({isOpen, onClose, onSuccess, onOpenAddGames, editSeries = null}) {
    const [seriesName, setSeriesName] = useState('');
    const [seriesType, setSeriesType] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (editSeries) {
            setIsEditMode(true);
            setSeriesName(editSeries.name);
            setSeriesType(editSeries.type);
            setDescription(editSeries.description);
            setStartDate(editSeries.start);
            setEndDate(editSeries.end);
        } else {
            setIsEditMode(false);
            handleClear();
        }
        setError(null);
    }, [editSeries]);

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

            const url = isEditMode
                ? `${import.meta.env.VITE_API_BASE_URL}/series/${editSeries.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/series/`;

            const method = isEditMode ? 'PUT' : 'POST';

            const body = isEditMode
                ? {
                    name: seriesName,
                    type: seriesType,
                    desc: description,
                    start: startDate,
                    end: endDate
                }
                : {
                    name: seriesName,
                    type: seriesType,
                    desc: description,
                    start: startDate,
                    end: endDate,
                    games: []
                };

            const response = await fetch(url,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create series');
            }

            const data = await response.json();
            const seriesId = data.seriesId || editSeries?.id;

            // Reset form
            handleClear();

            const action = isEditMode ? 'updated' : 'created';
            alert(`Series ${action} successfully!`);

            if (onSuccess) {
                onSuccess(data.seriesId);
            }

            // Optionally open add games modal
            if (!isEditMode && onOpenAddGames && seriesId) {
                onOpenAddGames(seriesId);
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

    const handleDelete = async () => {
        if (!isEditMode || !editSeries) {
            alert('No series selected to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete "${editSeries.name}"? This will remove all game associations.`)) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/series/${editSeries.id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete series');
            }

            alert('Series deleted successfully!');

            handleClear();

            if (onSuccess) {
                onSuccess(null);
            }

            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        setSeriesName('');
        setSeriesType('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setError(null);
    }

    const handleCancel = () => {
        handleClear();

        if (onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{isEditMode ? 'Edit Series' : 'Create Series'}</h2>
                {isEditMode && (
                    <div>
                        Editing: {editSeries.name}
                    </div>
                )}
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
                        <Button type="submit"
                                className="btn-primary"
                                text={saving ? "SAVING..." : (isEditMode ? "UPDATE SERIES" : "SAVE SERIES")}
                                disabled={saving}
                        />
                        {isEditMode && (
                            <Button onClick={handleDelete}
                                    className="btn-secondary"
                                    text="DELETE SERIES"
                                    disabled={saving}
                            />
                        )}
                        <Button onClick={handleCancel} className="btn-secondary" text="CANCEL"/>
                    </div>
                </form>
            </div>
        </div>
    )
}