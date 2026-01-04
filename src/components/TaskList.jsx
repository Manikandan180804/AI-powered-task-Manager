import React from 'react';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import TaskItem from './TaskItem';
import { FILTER_OPTIONS } from '../constants';

export default function TaskList({
    tasks,
    filter,
    onToggle,
    onDelete,
    onEdit,
    onAIPrioritize
}) {
    const getFilteredTasks = () => {
        // Already filtered by parent component
        return tasks;
    };

    const filteredTasks = getFilteredTasks();

    // Empty state
    if (filteredTasks.length === 0) {
        const emptyStates = {
            [FILTER_OPTIONS.ALL]: {
                icon: <ListTodo size={64} />,
                title: 'No tasks yet',
                message: 'Create your first task to get started!'
            },
            [FILTER_OPTIONS.TODAY]: {
                icon: <Clock size={64} />,
                title: 'Nothing due today',
                message: 'Enjoy your day or plan ahead!'
            },
            [FILTER_OPTIONS.UPCOMING]: {
                icon: <Calendar size={64} />,
                title: 'No upcoming tasks',
                message: 'All caught up! Time to plan ahead.'
            },
            [FILTER_OPTIONS.COMPLETED]: {
                icon: <CheckCircle2 size={64} />,
                title: 'No completed tasks',
                message: 'Complete some tasks to see them here.'
            },
            [FILTER_OPTIONS.OVERDUE]: {
                icon: <AlertTriangle size={64} />,
                title: 'No overdue tasks',
                message: 'Great job staying on top of things!'
            }
        };

        const state = emptyStates[filter] || emptyStates[FILTER_OPTIONS.ALL];

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-2xl)',
                textAlign: 'center',
                minHeight: '400px',
                color: 'var(--color-text-tertiary)'
            }}>
                <div style={{
                    marginBottom: 'var(--space-lg)',
                    opacity: 0.5
                }}>
                    {state.icon}
                </div>
                <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--color-text-secondary)'
                }}>
                    {state.title}
                </h3>
                <p>{state.message}</p>
            </div>
        );
    }

    return (
        <div>
            {/* AI Prioritize Button */}
            {filter === FILTER_OPTIONS.ALL && tasks.filter(t => !t.completed).length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <button
                        onClick={onAIPrioritize}
                        className="btn btn-primary"
                    >
                        <Sparkles size={20} />
                        AI Prioritize Tasks
                    </button>
                </div>
            )}

            {/* Task List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)'
            }}>
                {filteredTasks.map((task, index) => (
                    <div
                        key={task.id}
                        style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                        }}
                    >
                        <TaskItem
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
