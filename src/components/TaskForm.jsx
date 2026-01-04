import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PRIORITY, PRIORITY_LABELS } from '../constants';
import { generateTaskSuggestions } from '../services/aiService';

export default function TaskForm({ task, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || PRIORITY.MEDIUM,
        dueDate: task?.dueDate || '',
    });
    const [loading, setLoading] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }
        onSave(formData);
    };

    const handleAISuggest = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a task title first');
            return;
        }

        setAiSuggesting(true);
        try {
            const suggestions = await generateTaskSuggestions(formData.title);
            setFormData(prev => ({
                ...prev,
                description: suggestions.description || prev.description,
                priority: suggestions.suggestedPriority || prev.priority
            }));
        } catch (error) {
            alert('Failed to get AI suggestions: ' + error.message);
        } finally {
            setAiSuggesting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: 'var(--space-xl)' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-xl)'
                    }}>
                        <h2 className="gradient-text">
                            {task ? 'Edit Task' : 'New Task'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="btn btn-ghost"
                            style={{ padding: '0.5rem' }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title..."
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--space-sm)'
                            }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>
                                    Description
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAISuggest}
                                    className="btn btn-ghost btn-sm"
                                    disabled={aiSuggesting}
                                >
                                    <Sparkles size={16} />
                                    {aiSuggesting ? 'Thinking...' : 'AI Suggest'}
                                </button>
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add more details..."
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-md)',
                            marginTop: 'var(--space-xl)'
                        }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
