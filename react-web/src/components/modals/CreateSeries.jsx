import TextInput from "../form-parts/TextInput.jsx";
import {useState} from "react";
import DateInput from "../form-parts/DateInput.jsx";
import Button from "../form-parts/Button.jsx";

export default function CreateSeries(props) {
    const [seriesName, setSeriesName] = useState('');
    const [seriesType, setSeriesType] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!props.isOpen) return null;


    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Create Series</h2>
                <form onSubmit={props.onSuccess}>
                    <TextInput label="Series Name" value={seriesName} setValue={setSeriesName} />
                    <TextInput label="Series Type" value={seriesType} setValue={setSeriesType} />
                    <DateInput label="Start Date" value={startDate} setDateTime={setStartDate} />
                    <DateInput label="End Date" value={endDate} setDateTime={setEndDate} />
                    <TextInput label="Description" value={description} setValue={setDescription} />
                    <Button className="btn-primary" text="SAVE SERIES"/>
                    <Button onClick={() => console.log('Clicked Delete')} className="btn-secondary" text="DELETE SERIES"/>
                    <Button onClick={props.onClose} className="btn-secondary" text="CANCEL"/>
                </form>
            </div>
        </div>
    )
}