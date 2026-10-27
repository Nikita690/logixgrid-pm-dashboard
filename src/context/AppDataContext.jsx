import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dataService } from '../api/dataService';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextUsers, nextProjects, nextTasks] = await Promise.all([
        dataService.getUsers(),
        dataService.getProjects(),
        dataService.getTasks(),
      ]);
      setUsers(nextUsers);
      setProjects(nextProjects);
      setTasks(nextTasks);
    } catch (err) {
      setError(err.message || 'Failed to load workspace data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = useCallback(async (payload) => {
    const created = await dataService.createProject(payload);
    setProjects((current) => [created, ...current]);
    return created;
  }, []);

  const editProject = useCallback(async (id, payload) => {
    const updated = await dataService.updateProject(id, payload);
    setProjects((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const removeProject = useCallback(async (id) => {
    await dataService.deleteProject(id);
    setProjects((current) => current.filter((item) => item.id !== id));
    setTasks((current) => current.filter((item) => item.projectId !== id));
  }, []);

  const addTask = useCallback(async (payload) => {
    const created = await dataService.createTask(payload);
    setTasks((current) => [created, ...current]);
    return created;
  }, []);

  const editTask = useCallback(async (id, payload) => {
    const updated = await dataService.updateTask(id, payload);
    setTasks((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await dataService.deleteTask(id);
    setTasks((current) => current.filter((item) => item.id !== id));
  }, []);

  const userMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users],
  );
  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((project) => [project.id, project])),
    [projects],
  );

  const value = useMemo(
    () => ({
      users,
      projects,
      tasks,
      userMap,
      projectMap,
      loading,
      error,
      refresh,
      addProject,
      editProject,
      removeProject,
      addTask,
      editTask,
      removeTask,
    }),
    [
      users,
      projects,
      tasks,
      userMap,
      projectMap,
      loading,
      error,
      refresh,
      addProject,
      editProject,
      removeProject,
      addTask,
      editTask,
      removeTask,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}
