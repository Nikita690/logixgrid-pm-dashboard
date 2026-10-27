const PROJECT_TONES = {
  Active: 'success',
  Completed: 'primary',
  'On Hold': 'warning',
};

const TASK_TONES = {
  'To Do': 'secondary',
  'In Progress': 'info',
  Completed: 'success',
};

export function StatusBadge({ value, kind = 'task' }) {
  const tones = kind === 'project' ? PROJECT_TONES : TASK_TONES;
  return <span className={`badge text-bg-${tones[value] || 'secondary'}`}>{value}</span>;
}

export function PriorityBadge({ value }) {
  const tone = value === 'High' ? 'danger' : value === 'Medium' ? 'warning' : 'secondary';
  return <span className={`badge text-bg-${tone}`}>{value}</span>;
}
