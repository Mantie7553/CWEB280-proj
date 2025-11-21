import Button from "./form-parts/Button.jsx";

export default function SeriesHeader({series, onEdit, onAddGames}) {
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
                    <p>{series.type || 'SERIES TYPE'}</p>
                </div>
                <div>
                    <p>{`TOTAL GAMES: ${series.totalGames}` || 'NO GAMES'}</p>
                </div>
                <div>
                    <p>{`${series.start} TO ${series.end}` || 'NO DATE'}</p>
                    <p></p>
                </div>
                <div>
                    <p>{status || 'UNKNOWN'}</p>
                </div>
            </div>
            <div className="series-buttons">
                <Button onClick={onEdit} className="btn-secondary" text="EDIT"/>
                <Button onClick={onAddGames} className="btn-secondary" text="ADD GAMES"/>
            </div>
        </div>
    )
}