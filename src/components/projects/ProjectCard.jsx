import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dates';
import { StatusBadge } from '../common/StatusBadge';

export function ProjectCard({ project, users, onEdit, onDelete }) {
  const members = users.filter((user) => project.teamMemberIds.includes(user.id));

  return (
    <article className="panel project-card h-100">
      <div className="d-flex justify-content-between gap-2">
        <h2 className="h5 mb-1">{project.name}</h2>
        <StatusBadge kind="project" value={project.status} />
      </div>
      <p className="text-body-secondary">{project.description}</p>
      <dl className="meta-list">
        <div>
          <dt>Start</dt>
          <dd>{formatDate(project.startDate)}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDate(project.deadline)}</dd>
        </div>
      </dl>
      <div className="avatar-row mb-3">
        {members.map((member) => (
          <span key={member.id} className="avatar" title={member.name}>
            {member.name.charAt(0)}
          </span>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Link className="btn btn-sm btn-primary" to={`/projects/${project.id}`}>
          View
        </Link>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(project)}>
          Delete
        </button>
      </div>
    </article>
  );
}
