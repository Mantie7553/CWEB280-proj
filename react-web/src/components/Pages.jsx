export default function Pages([currentPage, setCurrentPage]) {

    return (
        <div>
            {'<< '}
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <span key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                          textDecoration: page === currentPage ? 'underline' : 'none'
                      }}
                >
                    {page}
                </span>
            ))}
            {' >>'}
        </div>
    )
}