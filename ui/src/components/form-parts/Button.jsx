/**
 * A shared component for all buttons going forward
 * @param props an onClick handler, className, and the buttons text
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
export default function Button (props) {
    return (
        <button onClick={props.onClick} className={props.className}>
            {props.text}
        </button>
    )
}