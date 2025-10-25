export default function Pages({currentPage, setCurrentPage, totalPages}) {

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage( currentPage + 1);
        }
    }

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    }

    return (
        <div>
            <button onClick={handlePrev} disabled={currentPage === 1}>
                {'<< '}
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageClick(page)}>
                    {page}
                </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === 3}>
                {' >>'}
            </button>
        </div>
    )
}