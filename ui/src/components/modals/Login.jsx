import {useState} from "react";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

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
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    /**
     * Clears the form before closing the modal
     * calls the onClose function passed in from Navbar.jsx
     */
    const handleClose = () => {
        setEmail('');
        setPassword('');
        setIsRegistering(false);
        setError('');
        onClose();
    }

    /**
     * Attempts to log in a user using the
     * users stored in the database
     * @param e the submission to prevent
     */
    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.detail || 'Login failed')
                }
                return resp.json();
            })
            .then(data => {
                onSuccess({
                    id: data.userId,
                    email: data.email
                });
                handleClose();
            })
            .catch((err) => {
                setError(err.message || 'Login failed. Try again.')
        })
            .finally(() => {
                setLoading(false);
            })
    }

    /**
     * Allows for creation of new account
     *  given an email and password
     * @param e the submission to prevent
     */
    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.detail || 'Registration failed')
                }
                return resp.json();
            })
            .then(data => {
                onSuccess({
                    id: data.userId,
                    email: data.email
                });
                handleClose();
            })
            .catch((err) => {
                setError(err.message || 'Registration failed. Try again.')
            })
            .finally(() => {
                setLoading(false);
            })

    }

    /**
     * Allows for authentication using Google
     *  Creates a new account if one does not already exist
     *  Logs into an existing account if there is one
     * @param credentialResp
     */
    const handleGoogle = (credentialResp) => {
        setLoading(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_BASE_URL}/user/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credential: credentialResp.credential
            })
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Google login failed')
                }
                return resp.json();
            })
            .then(data => {
                onSuccess({
                    id: data.userId,
                    email: data.email
                });
                handleClose();
            })
            .catch((err) => {
                setError(err.message || 'Google login failed. Try again.')
            })
            .finally(() => {
                setLoading(false);
            })
    }

    /**
     * For displaying an error if something goes wrong
     *  during the Google sign in
     */
    const googleErrorHandler = () => {
        setError('Google Sign-In failed. Please try again.')
    }

    return (
        <div className="modal-overlay">
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="modal-content">
                <button type="button" onClick={handleClose} className="modal-close">X</button>
                <h1 className="modal-title">{isRegistering ? 'CREATE ACCOUNT' : 'LOGIN'}</h1>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogle}
                        onError={googleErrorHandler}
                    />
                </GoogleOAuthProvider>
                <p className="modal-info">OR</p>
                {error && (
                    <div className="modal-error">
                        {error}
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" required value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className='form-input'
                           disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Password {isRegistering && '(min. 8 characters)'}
                    </label>
                    <input type="password" required value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="form-input"
                           disabled={loading}
                           minLength={isRegistering ? 8 : undefined}
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
                    </button>
                    <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
                </div>

                <div>
                    {isRegistering ? (
                        <p>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegistering(false);
                                    setError('');
                                }}
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegistering(true);
                                    setError('');
                                }}
                            >
                                Register here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}