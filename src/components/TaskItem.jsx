import React from 'react';
import { Trash2, Edit, Calendar, AlertCircle } from 'lucide-react';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../constants';
import { formatDueDate, isTaskOverdue } from '../utils/taskUtils';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
    const priorityColor = PRIORITY_COLORS[task.aiPriority || task.priority];
    const isOverdue = isTaskOverdue(task);

    return (
        <div
            className={`card animate-fade-in ${task.completed ? 'opacity-60' : ''}`}
            style={{
                borderLeft: `4px solid ${priorityColor}`,
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {/* Checkbox */}
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    style={{ marginTop: '2px' }}
                />

                {/* Task Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                        style={{
                            fontSize: '1.125rem',
                            marginBottom: '0.5rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                        }}
                    >
                        {task.title}
                    </h3>

                    {task.description && (
                        <p style={{
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            {task.description}
                        </p>
                    )}

                    {/* Tags and metadata */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}>
                        {/* Priority badge */}
                        <span
                            className="badge"
                            style={{
                                background: `${priorityColor}20`,
                                color: priorityColor,
                                border: `1px solid ${priorityColor}`
                            }}
                        >
                            {PRIORITY_LABELS[task.aiPriority || task.priority]}
                        </span>

                        {/* AI Priority indicator */}
                        {task.aiPriority && task.aiPriority !== task.priority && (
                            <span className="badge badge-primary">
                                AI Suggested
                            </span>
                        )}

                        {/* Due date */}
                        {task.dueDate && (
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    color: isOverdue ? 'var(--color-error)' : 'var(--color-text-secondary)'
                                }}
                            >
                                {isOverdue && <AlertCircle size={14} />}
                                <Calendar size={14} />
                                {formatDueDate(task.dueDate)}
                            </span>
                        )}
                    </div>

                    {/* AI Reason */}
                    {task.aiReason && (
                        <div
                            style={{
                                marginTop: '0.75rem',
                                padding: '0.5rem',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                fontStyle: 'italic'
                            }}
                        >
                            💡 AI: {task.aiReason}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onEdit(task)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.5rem' }}
                        title="Edit task"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.5rem', color: 'var(--color-error)' }}
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
