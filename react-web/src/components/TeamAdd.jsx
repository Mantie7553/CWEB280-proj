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
        <div className="data-entry-container">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-6">Add New Team</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter team name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">
                            Team Logo (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Max 5MB - JPG, PNG, GIF, SVG, WebP
                        </p>
                    </div>

                    {logoPreview && (
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Preview</label>
                            <div className="border rounded p-4 flex justify-center bg-gray-50">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="max-h-32 object-contain"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Adding...' : 'Add Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}