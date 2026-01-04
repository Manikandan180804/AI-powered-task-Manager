// Priority levels
export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

export const PRIORITY_LABELS = {
    [PRIORITY.LOW]: 'Low',
    [PRIORITY.MEDIUM]: 'Medium',
    [PRIORITY.HIGH]: 'High',
    [PRIORITY.URGENT]: 'Urgent'
};

export const PRIORITY_COLORS = {
    [PRIORITY.LOW]: 'var(--color-priority-low)',
    [PRIORITY.MEDIUM]: 'var(--color-priority-medium)',
    [PRIORITY.HIGH]: 'var(--color-priority-high)',
    [PRIORITY.URGENT]: 'var(--color-priority-urgent)'
};

// Task status
export const TASK_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

// Filter options
export const FILTER_OPTIONS = {
    ALL: 'all',
    TODAY: 'today',
    UPCOMING: 'upcoming',
    COMPLETED: 'completed',
    OVERDUE: 'overdue'
};

// View modes
export const VIEW_MODES = {
    DASHBOARD: 'dashboard',
    LIST: 'list'
};

// Local storage keys
export const STORAGE_KEYS = {
    TASKS: 'ai_task_manager_tasks',
    SETTINGS: 'ai_task_manager_settings',
    API_KEY: 'ai_task_manager_api_key'
};

// Default task
export const DEFAULT_TASK = {
    id: '',
    title: '',
    description: '',
    priority: PRIORITY.MEDIUM,
    dueDate: null,
    completed: false,
    createdAt: new Date().toISOString(),
    aiPriority: null,
    tags: []
};
