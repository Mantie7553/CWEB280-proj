import {useState} from "react";


export default function Login({isOpen, onClose, onSuccess}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;


    const handleClose = () => {
        setEmail('');
        setPassword('');
        onClose();
    }

    return (
        <div>
            <form>
                <button type="button" onClick={handleClose}>X</button>
                <div>
                    <label>Email</label>
                    <input type="email" required value={email}/>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" required value={password}/>
                </div>

                <div>
                    <button type="submit">Login</button>
                    <button type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </div>
    )
}