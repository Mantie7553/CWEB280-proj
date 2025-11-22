/**
 * A React component used to display information for a given series
 * in a list view
 * @param handleSeriesClick function called when a series is clicked
 * @param series optional series information passed in
 * @returns {JSX.Element}
 * @constructor
 * @author Mantie7553
 */
export default function Series({handleSeriesClick, series}) {

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
        <div key={series.id}
             onClick={() => handleSeriesClick(series.id)}
             className="series-card"
             >
            <div>
                <p className="series-text-lg">{series.type}</p>
                <h3 className="series-text-lg">{series.name}</h3>
                <p  className="series-text">{series.start} to {series.end}</p>
                <p  className="series-text">{status}</p>
            </div>
            <p  className="series-text">Games: {series.totalGames}</p>
        </div>
    )
}