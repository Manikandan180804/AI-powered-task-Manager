import { STORAGE_KEYS } from '../constants';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Load tasks from MongoDB via API
export const loadTasks = async () => {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        // Convert MongoDB _id to id for frontend compatibility
        return tasks.map(task => ({
            ...task,
            id: task._id,
            createdAt: task.createdAt || new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error loading tasks from API:', error);
        return [];
    }
};

// Save tasks is no longer needed as we'll use individual create/update/delete
// But keeping it for backward compatibility
export const saveTasks = async (tasks) => {
    // This function is deprecated - use createTask, updateTask, deleteTask instead
    console.warn('saveTasks is deprecated. Use individual CRUD operations.');
    return true;
};

// Create a new task
export const createTask = async (task) => {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const newTask = await response.json();
        return {
            ...newTask,
            id: newTask._id
        };
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

// Update a task
export const updateTask = async (taskId, updates) => {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        return {
            ...updatedTask,
            id: updatedTask._id
        };
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// Bulk update tasks (for AI prioritization)
export const bulkUpdateTasks = async (tasks) => {
    try {
        const response = await fetch(`${API_URL}/tasks/bulk-update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tasks })
        });

        if (!response.ok) {
            throw new Error('Failed to bulk update tasks');
        }

        const updatedTasks = await response.json();
        return updatedTasks.map(task => ({
            ...task,
            id: task._id
        }));
    } catch (error) {
        console.error('Error bulk updating tasks:', error);
        throw error;
    }
};

// Load settings from local storage
export const loadSettings = () => {
    try {
        const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!settingsJson) return {};

        return JSON.parse(settingsJson);
    } catch (error) {
        console.error('Error loading settings from storage:', error);
        return {};
    }
};

// Save settings to local storage
export const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings to storage:', error);
        return false;
    }
};

// Load API key
export const loadApiKey = () => {
    try {
        // Check for Gemini API key first (new format)
        let envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

        // Fallback to Hugging Face key for backward compatibility
        if (!envApiKey || envApiKey === 'your_api_key_here' || envApiKey === 'your_gemini_api_key_here') {
            envApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
        }

        if (envApiKey && envApiKey !== 'your_api_key_here' && envApiKey !== 'your_gemini_api_key_here') {
            return envApiKey;
        }

        // Fallback to localStorage
        return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    } catch (error) {
        console.error('Error loading API key:', error);
        return '';
    }
};

// Save API key
export const saveApiKey = (apiKey) => {
    try {
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
        return true;
    } catch (error) {
        console.error('Error saving API key:', error);
        return false;
    }
};

// Clear all storage
export const clearAllStorage = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};
