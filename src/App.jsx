import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { loadTasks, createTask, updateTask, deleteTask } from './utils/storage';
import { filterTasks, sortTasksByPriority, generateTaskId } from './utils/taskUtils';
import { prioritizeTasks } from './services/aiService';
import { VIEW_MODES, FILTER_OPTIONS, DEFAULT_TASK } from './constants';
import './index.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [currentView, setCurrentView] = useState(VIEW_MODES.DASHBOARD);
    const [currentFilter, setCurrentFilter] = useState(FILTER_OPTIONS.ALL);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [aiPrioritizing, setAiPrioritizing] = useState(false);

    // Load tasks on mount
    useEffect(() => {
        const fetchTasks = async () => {
            const loadedTasks = await loadTasks();
            setTasks(loadedTasks);
            setLoading(false);
        };
        fetchTasks();
    }, []);

    // Handle new task
    const handleNewTask = () => {
        setEditingTask(null);
        setShowTaskForm(true);
    };

    // Handle edit task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    // Handle save task
    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                // Update existing task
                const updated = await updateTask(editingTask.id, formData);
                setTasks(tasks.map(task =>
                    task.id === editingTask.id ? updated : task
                ));
            } else {
                // Create new task
                const newTaskData = {
                    ...DEFAULT_TASK,
                    ...formData,
                    createdAt: new Date().toISOString()
                };
                const newTask = await createTask(newTaskData);
                setTasks([newTask, ...tasks]);
            }
            setShowTaskForm(false);
            setEditingTask(null);
        } catch (error) {
            alert('Failed to save task: ' + error.message);
        }
    };

    // Handle delete task
    const handleDeleteTask = async (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (error) {
                alert('Failed to delete task: ' + error.message);
            }
        }
    };

    // Handle toggle task completion
    const handleToggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            try {
                const updated = await updateTask(taskId, { completed: !task.completed });
                setTasks(tasks.map(t => t.id === taskId ? updated : t));
            } catch (error) {
                alert('Failed to update task: ' + error.message);
            }
        }
    };

    // Handle AI prioritization
    const handleAIPrioritize = async () => {
        setAiPrioritizing(true);
        try {
            const result = await prioritizeTasks(tasks);
            setTasks(result.prioritizedTasks);
            alert(`AI Prioritization Complete!\n\n${result.reasoning}`);
        } catch (error) {
            alert('Failed to prioritize tasks: ' + error.message);
        } finally {
            setAiPrioritizing(false);
        }
    };

    // Handle view change
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
    };

    // Get filtered and sorted tasks
    const getDisplayedTasks = () => {
        const filtered = filterTasks(tasks, currentFilter);
        return sortTasksByPriority(filtered);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg-primary)'
            }}>
                <div className="animate-pulse" style={{ textAlign: 'center' }}>
                    <Loader size={48} style={{ color: 'var(--color-primary)' }} />
                    <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-bg-primary)'
        }}>
            {/* Header */}
            <Header
                onNewTask={handleNewTask}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />

            {/* Main Container */}
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden'
            }}>
                {/* Sidebar */}
                <Sidebar
                    currentView={currentView}
                    currentFilter={currentFilter}
                    onViewChange={handleViewChange}
                    onFilterChange={handleFilterChange}
                    tasks={tasks}
                    isOpen={sidebarOpen}
                />

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: 'var(--space-2xl) var(--space-xl)'
                }}>
                    <div className="container">
                        {currentView === VIEW_MODES.DASHBOARD ? (
                            <Dashboard tasks={tasks} />
                        ) : (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--space-xl)'
                                }}>
                                    <h1 className="gradient-text">
                                        {currentFilter === FILTER_OPTIONS.ALL && 'All Tasks'}
                                        {currentFilter === FILTER_OPTIONS.TODAY && 'Today\'s Tasks'}
                                        {currentFilter === FILTER_OPTIONS.UPCOMING && 'Upcoming Tasks'}
                                        {currentFilter === FILTER_OPTIONS.COMPLETED && 'Completed Tasks'}
                                        {currentFilter === FILTER_OPTIONS.OVERDUE && 'Overdue Tasks'}
                                    </h1>
                                    <button
                                        onClick={handleNewTask}
                                        className="btn btn-primary"
                                    >
                                        New Task
                                    </button>
                                </div>

                                <TaskList
                                    tasks={getDisplayedTasks()}
                                    filter={currentFilter}
                                    onToggle={handleToggleTask}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleEditTask}
                                    onAIPrioritize={handleAIPrioritize}
                                />

                                {aiPrioritizing && (
                                    <div style={{
                                        position: 'fixed',
                                        bottom: 'var(--space-xl)',
                                        right: 'var(--space-xl)',
                                        background: 'var(--color-surface)',
                                        padding: 'var(--space-md) var(--space-lg)',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: 'var(--shadow-xl)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-md)'
                                    }}>
                                        <Loader className="animate-pulse" size={20} style={{ color: 'var(--color-primary)' }} />
                                        <span>AI is prioritizing your tasks...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Task Form Modal */}
            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onSave={handleSaveTask}
                    onCancel={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
}

export default App;
