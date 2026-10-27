export function PaginationBar({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav aria-label="Task pagination" className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <p className="mb-0 small text-body-secondary">
        Page {page} of {pageCount}
      </p>
      <ul className="pagination mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page - 1)}>
            Prev
          </button>
        </li>
        {pages.map((item) => (
          <li key={item} className={`page-item ${item === page ? 'active' : ''}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(item)}>
              {item}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === pageCount ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
