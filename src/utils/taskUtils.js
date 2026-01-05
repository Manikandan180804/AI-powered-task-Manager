import { isToday, isTomorrow, isPast, isAfter, format, differenceInDays } from 'date-fns';
import { PRIORITY, FILTER_OPTIONS } from '../constants';

// Filter tasks based on filter option
export const filterTasks = (tasks, filter) => {
    const now = new Date();

    switch (filter) {
        case FILTER_OPTIONS.TODAY:
            return tasks.filter(task =>
                !task.completed && task.dueDate && isToday(new Date(task.dueDate))
            );

        case FILTER_OPTIONS.UPCOMING:
            return tasks.filter(task => {
                if (!task.dueDate || task.completed) return false;
                const taskDate = new Date(task.dueDate);
                return !isToday(taskDate) && isAfter(taskDate, now);
            });

        case FILTER_OPTIONS.COMPLETED:
            return tasks.filter(task => task.completed);

        case FILTER_OPTIONS.OVERDUE:
            return tasks.filter(task =>
                !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
            );

        case FILTER_OPTIONS.ALL:
        default:
            return tasks;
    }
};

// Sort tasks by priority
export const sortTasksByPriority = (tasks) => {
    const priorityOrder = {
        [PRIORITY.URGENT]: 4,
        [PRIORITY.HIGH]: 3,
        [PRIORITY.MEDIUM]: 2,
        [PRIORITY.LOW]: 1
    };

    return [...tasks].sort((a, b) => {
        const aPriority = a.aiPriority || a.priority;
        const bPriority = b.aiPriority || b.priority;
        return priorityOrder[bPriority] - priorityOrder[aPriority];
    });
};

// Sort tasks by due date
export const sortTasksByDueDate = (tasks) => {
    return [...tasks].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
};

// Get task statistics
export const getTaskStatistics = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const overdue = tasks.filter(t =>
        !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
    ).length;
    const today = tasks.filter(t =>
        !t.completed && t.dueDate && isToday(new Date(t.dueDate))
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        total,
        completed,
        active,
        overdue,
        today,
        completionRate
    };
};

// Format due date
export const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';

    const date = new Date(dueDate);
    const now = new Date();

    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';

    const days = differenceInDays(date, now);

    if (days < 0) {
        return `${Math.abs(days)} days overdue`;
    } else if (days <= 7) {
        return format(date, 'EEEE');
    } else {
        return format(date, 'MMM d, yyyy');
    }
};

// Check if task is overdue
export const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
};

// Get priority distribution
export const getPriorityDistribution = (tasks) => {
    const active = tasks.filter(t => !t.completed);

    return {
        [PRIORITY.URGENT]: active.filter(t => t.priority === PRIORITY.URGENT).length,
        [PRIORITY.HIGH]: active.filter(t => t.priority === PRIORITY.HIGH).length,
        [PRIORITY.MEDIUM]: active.filter(t => t.priority === PRIORITY.MEDIUM).length,
        [PRIORITY.LOW]: active.filter(t => t.priority === PRIORITY.LOW).length
    };
};

// Generate task ID
export const generateTaskId = () => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
