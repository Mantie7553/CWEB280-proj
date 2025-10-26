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
        <div>
            <form onSubmit={handleSubmit}>
                <button type="button" onClick={handleClose}>X</button>
                <div>
                    <label>Email</label>
                    <input type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" required value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <button type="submit">Login</button>
                    <button type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </div>
    )
}