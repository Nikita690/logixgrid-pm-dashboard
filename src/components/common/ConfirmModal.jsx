import { Modal } from 'react-bootstrap';

export function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
  busy = false,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
