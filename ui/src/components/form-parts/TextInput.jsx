/**
 * A shared component for all text inputs going forward
 * @param props a labels text, the inputs value, and a function to set that value
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
export default function TextInput(props) {
    return (
        <div className="form-group">
            <label className="form-label">
                {props.label}
            </label>
            <input
                type="text"
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                className="form-input"
                required
            />
        </div>
    )
}