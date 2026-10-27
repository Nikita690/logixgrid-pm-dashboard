export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-block">
      <div className="state-icon error">!</div>
      <h2 className="h5 mt-3">Something went wrong</h2>
      <p className="text-body-secondary">{message || 'Please try again.'}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
