
export default function DateInput(props) {
    return (
        <div className="data-entry-datetime">
            <label className="data-entry-label">
                {props.label}
            </label>
            <input
                type="date"
                value={props.dateTime}
                onChange={(e) => props.setDateTime(e.target.value)}
                className="data-entry-input"
                required
            />
        </div>
    )
}