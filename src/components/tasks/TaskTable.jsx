import { formatDate, isOverdue } from '../../utils/dates';
import { EmptyState } from '../common/EmptyState';
import { PriorityBadge, StatusBadge } from '../common/StatusBadge';

export function TaskTable({ tasks, userMap, projectMap, onEdit, onDelete, onStatusChange, onView }) {
  if (!tasks.length) {
    return <EmptyState title="No tasks match" message="Try another search or clear a filter." />;
  }

  return (
    <div className="table-responsive panel p-0">
      <table className="table align-middle mb-0 task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Due</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={isOverdue(task) ? 'overdue-row' : ''}>
              <td>
                <button type="button" className="link-button" onClick={() => onView(task)}>
                  {task.title}
                </button>
              </td>
              <td>{projectMap[task.projectId]?.name || '—'}</td>
              <td>{userMap[task.assignedUserId]?.name || 'Unassigned'}</td>
              <td>
                <PriorityBadge value={task.priority} />
              </td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={task.status}
                  onChange={(event) => onStatusChange(task, event.target.value)}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>
              <td>{formatDate(task.createdDate)}</td>
              <td>{formatDate(task.dueDate)}</td>
              <td className="text-end text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
