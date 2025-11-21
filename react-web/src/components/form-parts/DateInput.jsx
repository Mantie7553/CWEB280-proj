
export default function DateInput({label, dateTime, setDateTime}) {
    return (
        <div className="data-entry-datetime">
            <label className="form-label">
                {label}
            </label>
            <input
                type="date"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="data-entry-input"
                required
            />
        </div>
    )
}