export function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function toInputDate(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export function todayInputDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getPeriodBounds(month, year) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export function inRange(value, start, end) {
  const date = parseDate(value);
  if (!date) return false;
  return date >= start && date <= end;
}

export function isOverdue(task, now = new Date()) {
  if (!task || task.status === 'Completed') return false;
  const due = parseDate(task.dueDate);
  if (!due) return false;
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due < cutoff;
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
