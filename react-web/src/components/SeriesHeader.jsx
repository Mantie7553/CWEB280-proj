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
        <>
            <div>
                <h1>SERIES TITLE</h1>
                <p>{series.title}</p>
                <div>
                    <div>
                        <p>SERIES TYPE</p>
                        <p>{series.type}</p>
                    </div>
                    <div>
                        <p>TOTAL GAMES</p>
                        <p>{series.totalGames || 0}</p>
                    </div>
                    <div>
                        <p>DATES</p>
                        <p>{series.start} to {series.end}</p>
                    </div>
                    <div>
                        <p>STATUS</p>
                        <p>{status}</p>
                    </div>
                </div>
                <div>
                    <Button onClick={onEdit} className="btn-secondary" text="EDIT"/>
                    <Button onClick={onAddGames} className="btn-secondary" text="ADD GAMES"/>
                </div>
            </div>
        </>
    )
}