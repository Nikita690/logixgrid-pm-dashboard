export function LoadingState({ label = 'Loading workspace…' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="spinner-border text-primary" />
      <p className="mb-0 mt-3 text-body-secondary">{label}</p>
    </div>
  );
}
