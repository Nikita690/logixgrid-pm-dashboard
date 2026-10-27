const GMAIL_PATTERN = /^[^\s@]+@gmail\.com$/i;

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required.';
  if (!GMAIL_PATTERN.test(email.trim())) {
    return 'Use a valid @gmail.com email address.';
  }
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
}

export function validateProject(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Project name is required.';
  if (!values.description?.trim()) errors.description = 'Description is required.';
  if (!values.startDate) errors.startDate = 'Start date is required.';
  if (!values.deadline) errors.deadline = 'Deadline is required.';
  if (values.startDate && values.deadline && values.deadline < values.startDate) {
    errors.deadline = 'Deadline cannot be before the start date.';
  }
  if (!values.status) errors.status = 'Status is required.';
  if (!values.teamMemberIds?.length) {
    errors.teamMemberIds = 'Select at least one team member.';
  }
  return errors;
}

export function validateTask(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required.';
  if (!values.description?.trim()) errors.description = 'Description is required.';
  if (!values.projectId) errors.projectId = 'Project is required.';
  if (!values.assignedUserId) errors.assignedUserId = 'Assigned user is required.';
  if (!values.priority) errors.priority = 'Priority is required.';
  if (!values.status) errors.status = 'Status is required.';
  if (!values.dueDate) errors.dueDate = 'Due date is required.';
  return errors;
}
