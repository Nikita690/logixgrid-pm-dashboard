import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { todayInputDate } from '../../utils/dates';
import { validateProject } from '../../utils/validators';

const EMPTY = {
  name: '',
  description: '',
  startDate: todayInputDate(),
  deadline: '',
  status: 'Active',
  teamMemberIds: [],
};

export function ProjectForm({ show, project, users, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (show) {
      setValues(
        project
          ? {
              name: project.name,
              description: project.description,
              startDate: project.startDate,
              deadline: project.deadline,
              status: project.status,
              teamMemberIds: project.teamMemberIds || [],
            }
          : EMPTY,
      );
      setErrors({});
      setFormError('');
    }
  }, [show, project]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function toggleMember(id) {
    setValues((current) => {
      const exists = current.teamMemberIds.includes(id);
      return {
        ...current,
        teamMemberIds: exists
          ? current.teamMemberIds.filter((item) => item !== id)
          : [...current.teamMemberIds, id],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProject(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    setFormError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Unable to save project.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{project ? 'Edit project' : 'New project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError ? <div className="alert alert-danger">{formError}</div> : null}
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Project name</label>
              <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={values.name} onChange={(e) => updateField('name', e.target.value)} />
              {errors.name ? <div className="invalid-feedback">{errors.name}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} value={values.status} onChange={(e) => updateField('status', e.target.value)}>
                <option>Active</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows={3} value={values.description} onChange={(e) => updateField('description', e.target.value)} />
              {errors.description ? <div className="invalid-feedback">{errors.description}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Start date</label>
              <input type="date" className={`form-control ${errors.startDate ? 'is-invalid' : ''}`} value={values.startDate} onChange={(e) => updateField('startDate', e.target.value)} />
              {errors.startDate ? <div className="invalid-feedback">{errors.startDate}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Deadline</label>
              <input type="date" className={`form-control ${errors.deadline ? 'is-invalid' : ''}`} value={values.deadline} onChange={(e) => updateField('deadline', e.target.value)} />
              {errors.deadline ? <div className="invalid-feedback">{errors.deadline}</div> : null}
            </div>
            <div className="col-12">
              <label className="form-label">Team members</label>
              <div className={`member-grid ${errors.teamMemberIds ? 'is-invalid' : ''}`}>
                {users.map((user) => (
                  <label key={user.id} className="member-chip">
                    <input type="checkbox" checked={values.teamMemberIds.includes(user.id)} onChange={() => toggleMember(user.id)} />
                    <span>
                      {user.name}
                      <small>{user.role}</small>
                    </span>
                  </label>
                ))}
              </div>
              {errors.teamMemberIds ? <div className="text-danger small mt-1">{errors.teamMemberIds}</div> : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save project'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
