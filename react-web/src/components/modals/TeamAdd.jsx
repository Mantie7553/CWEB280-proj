import {useEffect, useState} from "react";
import TextInput from "../form-parts/TextInput.jsx";
import Button from "../form-parts/Button.jsx";

/**
 * A modal used in the Data Entry page for adding new teams to the database
 *  - handles the file uploads for team logos
 * @param isOpen boolean for checking if the modal is open or not
 * @param onClose function that handles closing the modal
 * @param onSuccess function for handling when data is successfully submitted
 * @param editTeam
 * @returns {JSX.Element|null} returns a modal used for entering a new team into the database
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function TeamAdd({isOpen, onClose, onSuccess, editTeam = null}) {
    const [teamName, setTeamName] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [keepExistingLogo, setKeepExistingLogo] = useState(true);

    // Load team data when editTeam changes
    useEffect(() => {
        if (editTeam) {
            setIsEditMode(true);
            setTeamName(editTeam.name);
        } else {
            setIsEditMode(false);
            setTeamName('');
        }
        setLogoFile(null);
        setLogoPreview('');
        setKeepExistingLogo(true);
    }, [editTeam]);

    /**
     * File upload handler
     *  - confirms files are the proper type (image) and size (5MB)
     *  - shows the preview of the image being uploaded
     * @param e
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG, PNG, GIF, SVG, or WebP)');
                return;
            }

            setLogoFile(file);
            setKeepExistingLogo(false);
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    /**
     * Handles closing the modal
     *  - resets all fields in the modal and removes the previewed file if it exists
     *  - calls the onClose function from DataEntry.jsx
     */
    const handleClose = () => {
        handleClear();
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview('');
        onClose();
    };

    /**
     * Clears all form fields
     */
    const handleClear = () => {
        setTeamName('');
        setLogoFile(null);
        setKeepExistingLogo(true);
    };

    /**
     * Handles deleting the team
     *  Asks user to confirm deletion
     */
    const handleDelete = () => {
        if (!isEditMode || !editTeam) {
            alert('No team selected to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${editTeam.name}?`)) {
            return;
        }

        setIsUploading(true);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/team/delete/${editTeam.id}`, {method: 'DELETE'})
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.error || 'Failed to delete team');
                }
                return resp.json();
            })
            .then(data => {
                alert('Team deleted successfully');
                handleClear();
                onSuccess();
                onClose();
            })
            .catch(err => {
                alert(`Failed to delete team: ${err.message}`);
            })
            .finally(() => {
                setIsUploading(false);
            })
    };

    /**
     * Handles the submission of a new team
     * @param e the submission to prevent
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName.trim()) {
            alert('Please enter a team name');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('teamName', teamName);

            if (logoFile) {
                formData.append('logoFile', logoFile);
            }

            if (isEditMode) {
                formData.append('keepExistingLogo', keepExistingLogo);
            }

            const url = isEditMode
                ? `${import.meta.env.VITE_API_BASE_URL}/team/update/${editTeam.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/team/add`;

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to add team');
            }

            if (data.id) {
                const action = isEditMode ? 'updated' : 'added';
                alert(`Team ${action} successfully: ${data.name}`);
                handleClear();
                onSuccess();
                onClose();
            }
        } catch (error) {
            alert(`Failed to ${isEditMode ? 'update' : 'add'} team. Please try again.`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{isEditMode ? 'Edit' : 'Add'} Team</h2>
                {isEditMode && (
                    <div>
                        Editing: {editTeam.name}
                    </div>
                )}
                <form onSubmit={handleSubmit}>

                    <TextInput label="Team Name" value={teamName} setValue={setTeamName}/>

                    <div className="form-group">
                        <label className="form-label">
                            Team Logo (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                            onChange={handleFileChange}
                            className="form-select"
                        />
                        <p className="form-label">
                            Max 5MB - JPG, PNG, GIF, SVG, WebP
                        </p>
                    </div>
                    {isEditMode && editTeam.logoFName && keepExistingLogo && !logoFile && (
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Current Logo:</label>
                            <img
                                src={`/public/uploads/${editTeam.logoFName}`}
                                alt={`${editTeam.name} logo`}
                                style={{maxWidth: '200px', maxHeight: '200px'}}
                                className="border rounded"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Upload a new file to replace this logo, or keep the existing file.
                            </p>
                        </div>
                    )}
                    {logoPreview && (
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Preview</label>
                            <div>
                                <img src={logoPreview} alt="Logo preview"/>
                            </div>
                        </div>
                    )}

                    <div className="form-buttons">
                        <Button
                            onClick={handleSubmit}
                            className="btn-primary"
                            disabled={isUploading}
                            text={isEditMode ? 'UPDATE TEAM' : 'ADD TEAM'}
                        />
                        <Button onClick={handleDelete}
                                className="btn-secondary" text="DELETE TEAM"/>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-secondary"
                            disabled={isUploading}
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}