import {useState} from "react";
import {confirmAccount} from "../controllers/account-controller.jsx";


export default function Login({isOpen, onClose, onSuccess}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;


    const handleClose = () => {
        setEmail('');
        setPassword('');
        onClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let accountInfo = confirmAccount(email, password);
        // Any account that has an ID is an existing account
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