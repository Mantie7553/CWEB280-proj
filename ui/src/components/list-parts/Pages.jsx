/**
 * Pagination for lists, created as its own component to make
 *  using it optionally cleaner
 * @param currentPage the current page number
 * @param setCurrentPage function to set the current page number
 * @param totalPages the number of total pages
 * @returns {JSX.Element} a pagination option used in some lists
 * @constructor
 * @authors Mantie7553, Kinley6573
 */
export default function Pages({currentPage, setCurrentPage, totalPages}) {

    /**
     * Handles moving the pages back by 1 unless it is already at the first page
     */
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    /**
     * Handles moving the pages forward by 1 unless it is already at the last page
     */
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    /**
     * Handles moving the page to the selected page
     * @param pageNum the page number of the button that was clicked
     */
    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    }

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={handlePrev}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}