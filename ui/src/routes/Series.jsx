import SeriesHeader from "../components/SeriesHeader.jsx";
import List from "../components/list-parts/List.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AddSeriesGames from "../components/modals/AddSeriesGames.jsx";
import CreateSeries from "../components/modals/CreateSeries.jsx";

/**
 * Page displaying a specific Series contents
 *  Including the games that belong to that series
 * @param currentAccount the currently logged in account
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
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
     * Refreshes data for the series after a game has been added
     *  hides the add games modal
     */
    const handleGamesAdded = () => {
        fetchSeriesData();
        setShowAddGames(false);
    };

    /**
     * Refreshes data for the series after its information has been updated
     *  hides the edit / create Series modal
     */
    const handleSeriesUpdated = () => {
        fetchSeriesData();
        setShowEditSeries(false);
    };

    // Display simple loading message
    if (loading) {
        return (
            <div className="series-page">
                <div className="loading-container">
                    <div>Loading series...</div>
                </div>
            </div>
        );
    }

    // Display an error and a way to easily leave the page
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

    // Display a simple message that no data was found
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