import Button from "../components/form-parts/Button.jsx";
import SeriesHeader from "../components/SeriesHeader.jsx";
import List from "../components/list-parts/List.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AddSeriesGames from "../components/modals/AddSeriesGames.jsx";
import CreateSeries from "../components/modals/CreateSeries.jsx";

export default function Series({currentAccount}) {
    const {seriesId} = useParams();
    const {navigate} = useNavigate();

    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddGames, setShowAddGames] = useState(false);
    const [showEditSeries, setShowEditSeries] = useState(false);

    /**
     * Gets series data on load
     */
    useEffect(() => {
        fetchSeriesData();
    }, [seriesId]);

    /**
     * function for getting data for a specific series
      */
    const fetchSeriesData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/series/detail/${seriesId}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Series not found");
                }
                throw new Error("Failed to fetch series data");
            }

            const data = await response.json();
            setSeries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Opens the modal for editing a series
     */
    const handleEdit = () => {
        setShowEditSeries(true);
    };

    /**
     * Opens modal for adding games to a series
     */
    const handleAddGames = () => {
        setShowAddGames(true);
    };

    /**
     *
     */
    const handleGamesAdded = () => {
        // Refresh series data after games are added
        fetchSeriesData();
        setShowAddGames(false);
    };

    const handleSeriesUpdated = () => {
        // Refresh series data after edit
        fetchSeriesData();
        setShowEditSeries(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="series-page">
                <div className="loading-container">
                    <div>Loading series...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="series-page">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/stats')}>
                        Back to Stats
                    </button>
                </div>
            </div>
        );
    }

    // No series found
    if (!series) {
        return (
            <div className="series-page">
                <div className="empty-container">
                    <p>Series not found</p>
                    <button onClick={() => navigate('/stats')}>
                        Back to Stats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SeriesHeader
                series={series}
                onEdit={handleEdit}
                onAddGames={handleAddGames}
                currentAccount={currentAccount}
            />
            <List sectionName="SERIES GAMES" seriesData={series}/>

            <AddSeriesGames
                isOpen={showAddGames}
                onClose={() => setShowAddGames(false)}
                onSave={handleGamesAdded}
                seriesId={seriesId}
                />

            <CreateSeries
                isOpen={showEditSeries}
                onClose={() => setShowEditSeries(false)}
                onSuccess={handleSeriesUpdated}
                editSeries={series}
            />
        </>
    )
}