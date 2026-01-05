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

    // Empty state - show nothing if no tasks
    if (filteredTasks.length === 0) {
        return null;
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
