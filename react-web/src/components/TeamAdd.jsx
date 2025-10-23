import {useState} from "react";

export default function TeamAdd({isOpen, onClose, onSuccess}) {

    const [teamName, setTeamName] = useState('');
    const [logoFName, setLogoFName] = useState('');

    if (!isOpen) return null;


    const handleClose = () => {
        setTeamName('');
        setLogoFName('');
        onClose();
    }

    return (
        <div>
            <form>
                <button type="button" onClick={handleClose}>X</button>
                <div>
                    <label>Team Name</label>
                    <input type="text" required/>
                </div>

                <div>
                    <label>Upload</label>
                    <input type="file"/>
                </div>

                <div>
                    <button type="submit">Add Team</button>
                    <button type="button" onClick={handleClose}>Clear</button>
                </div>
            </form>
        </div>
    )
}