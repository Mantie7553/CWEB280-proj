
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