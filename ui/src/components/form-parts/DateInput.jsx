/**
 * A shared component for all date inputs going forward
 * @param label The labels text for the date input
 * @param dateTime The value that this can be set to
 * @param setDateTime The function to set the value
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
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