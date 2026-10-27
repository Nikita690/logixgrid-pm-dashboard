import { Modal } from 'react-bootstrap';
import { formatDate, isOverdue } from '../../utils/dates';
import { PriorityBadge, StatusBadge } from '../common/StatusBadge';

export function TaskDetailModal({ task, userMap, projectMap, onClose, onEdit }) {
  if (!task) return null;

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{task.description}</p>
        <dl className="meta-list stacked">
          <div>
            <dt>Project</dt>
            <dd>{projectMap[task.projectId]?.name || '—'}</dd>
          </div>
          <div>
            <dt>Assigned user</dt>
            <dd>{userMap[task.assignedUserId]?.name || 'Unassigned'}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <PriorityBadge value={task.priority} />
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge value={task.status} />
            </dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(task.createdDate)}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd>
              {formatDate(task.dueDate)}
              {isOverdue(task) ? <span className="badge text-bg-danger ms-2">Overdue</span> : null}
            </dd>
          </div>
        </dl>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onEdit(task)}>
          Edit
        </button>
      </Modal.Footer>
    </Modal>
  );
}
