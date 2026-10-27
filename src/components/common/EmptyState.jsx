export function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="state-block empty">
      <div className="state-icon">○</div>
      <h2 className="h5 mt-3">{title}</h2>
      <p className="text-body-secondary mb-3">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
