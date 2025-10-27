import {useState} from "react";

export default function TeamAdd({isOpen, onClose, onSuccess}) {
    const [teamName, setTeamName] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

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
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    const handleClose = () => {
        setTeamName('');
        setLogoFile(null);
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview('');
        onClose();
    };

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

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/team/add`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to add team');
            }

            alert(`Team "${data.name}" added successfully!`);
            handleClose();

            if (onSuccess) {
                onSuccess(data);
            }

        } catch (error) {
            alert(`Error adding team: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Add New Team</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

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

                    {logoPreview && (
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Preview</label>
                            <div>
                                <img src={logoPreview} alt="Logo preview"/>
                            </div>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Adding...' : 'Add Team'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-secondary"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}