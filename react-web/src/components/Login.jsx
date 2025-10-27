import {useState} from "react";
import {confirmAccount} from "../controllers/account-controller.jsx";

/**
 * Modal for handling user authentication
 *  - returns null if it is not currently being shown
 * @param isOpen boolean value for if the login is currently open or not
 * @param onClose function called when attempting to close the login modal
 * @param onSuccess function called when a login happens successfully
 * @returns {JSX.Element|null} a Login modal used to authenticate a user
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Login({isOpen, onClose, onSuccess}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    /**
     * Clears the form before closing the modal
     * calls the onClose function passed in from Navbar.jsx
     */
    const handleClose = () => {
        setEmail('');
        setPassword('');
        onClose();
    }

    /**
     * Confirms that the entered credentials match one of the accounts stored
     *  in the accountController
     *  - if an ID that is not 0 is returned then the account must exist in the accountController
     *  - calls the onSuccess function passed in from App.jsx
     *  - else shows an alert that the email or password is not correct
     * @param e the submit event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        let accountInfo = confirmAccount(email, password);
        if (accountInfo.id !== 0) {
            onSuccess(accountInfo);
            handleClose();
        }
        else {
            alert('Email or password is not correct');
        }
    }

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit} className="modal-content">
                <button type="button" onClick={handleClose} className="modal-close">X</button>
                <h1 className="modal-title">LOGIN</h1>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='form-input'/>
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" required value={password}
                           onChange={(e) => setPassword(e.target.value)}
                    className="form-input"/>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn-primary">Login</button>
                    <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    )
}