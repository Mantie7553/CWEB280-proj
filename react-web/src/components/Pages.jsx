export default function Pages({currentPage, setCurrentPage, totalPages}) {
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

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