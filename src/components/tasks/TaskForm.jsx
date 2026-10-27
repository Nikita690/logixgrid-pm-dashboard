import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { todayInputDate } from '../../utils/dates';
import { validateTask } from '../../utils/validators';

function emptyValues(defaultProjectId) {
  return {
    title: '',
    description: '',
    projectId: defaultProjectId || '',
    assignedUserId: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
    createdDate: todayInputDate(),
  };
}

export function TaskForm({ show, task, projects, users, defaultProjectId, onClose, onSubmit }) {
  const [values, setValues] = useState(emptyValues(defaultProjectId));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!show) return;
    setValues(
      task
        ? {
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            assignedUserId: task.assignedUserId,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
            createdDate: task.createdDate,
          }
        : emptyValues(defaultProjectId),
    );
    setErrors({});
    setFormError('');
  }, [show, task, defaultProjectId]);

  const assignableUsers = useMemo(() => {
    const project = projects.find((item) => item.id === values.projectId);
    if (!project) return users;
    const team = users.filter((user) => project.teamMemberIds.includes(user.id));
    return team.length ? team : users;
  }, [projects, users, values.projectId]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTask(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    setFormError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Unable to save task.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{task ? 'Edit task' : 'New task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError ? <div className="alert alert-danger">{formError}</div> : null}
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Title</label>
              <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={values.title} onChange={(e) => updateField('title', e.target.value)} />
              {errors.title ? <div className="invalid-feedback">{errors.title}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Project</label>
              <select className={`form-select ${errors.projectId ? 'is-invalid' : ''}`} value={values.projectId} onChange={(e) => updateField('projectId', e.target.value)}>
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId ? <div className="invalid-feedback">{errors.projectId}</div> : null}
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows={3} value={values.description} onChange={(e) => updateField('description', e.target.value)} />
              {errors.description ? <div className="invalid-feedback">{errors.description}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Assigned user</label>
              <select className={`form-select ${errors.assignedUserId ? 'is-invalid' : ''}`} value={values.assignedUserId} onChange={(e) => updateField('assignedUserId', e.target.value)}>
                <option value="">Select user</option>
                {assignableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.assignedUserId ? <div className="invalid-feedback">{errors.assignedUserId}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Priority</label>
              <select className="form-select" value={values.priority} onChange={(e) => updateField('priority', e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={values.status} onChange={(e) => updateField('status', e.target.value)}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Created date</label>
              <input type="date" className="form-control" value={values.createdDate} onChange={(e) => updateField('createdDate', e.target.value)} disabled={Boolean(task)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Due date</label>
              <input type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} value={values.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
              {errors.dueDate ? <div className="invalid-feedback">{errors.dueDate}</div> : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save task'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
