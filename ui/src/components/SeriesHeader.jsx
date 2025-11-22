import Button from "./form-parts/Button.jsx";

/**
 * Header used to display information for a series
 * @param series the data for a given series
 * @param onEdit function called when editing a series
 * @param onAddGames function called when adding games to a series
 * @param currentAccount the currently logged in account
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
export default function SeriesHeader({series, onEdit, onAddGames, currentAccount}) {
    if (!series) {
        return (
            <div className="series-header-container">
                <div>Loading series information...</div>
            </div>
        );
    }

    const now = new Date();
    const startDate = new Date(series.start);
    const endDate = new Date(series.end);

    let status = "Upcoming";
    if (now >= startDate && now <= endDate) {
        status = "Active";
    } else if (now > endDate) {
        status = "Completed";
    }

    return (
        <div className="series-header">
            <h1 className="series-title">{series.name || 'SERIES TITLE'}</h1>
            <h4 className="series-desc">{series.description || ''}</h4>
            <div className="series-text">
                <div>
                    <p id="series-type">{series.type || 'SERIES TYPE'}</p>
                </div>
                <div>
                    <p id="series-game-count">{`TOTAL GAMES: ${series.totalGames}` || 'NO GAMES'}</p>
                </div>
                <div>
                    <p  id="series-dates">{`${series.start} TO ${series.end}` || 'NO DATE'}</p>
                </div>
                <div>
                    <p  id="series-status">{status || 'UNKNOWN'}</p>
                </div>
            </div>
            {currentAccount && (
                <div className="series-buttons">
                    <Button onClick={onEdit} className="btn-secondary" text="EDIT"/>
                    <Button onClick={onAddGames} className="btn-secondary" text="ADD GAMES"/>
                </div>
            )}
        </div>
    )
}