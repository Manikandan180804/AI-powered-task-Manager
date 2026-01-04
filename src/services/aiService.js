import { loadApiKey, saveApiKey } from '../utils/storage';
import { PRIORITY } from '../constants';

// Backend API proxy URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to call AI via backend proxy (avoids CORS)
const callHuggingFaceAPI = async (apiKey, prompt, maxTokens = 2000, retries = 3) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            console.log(`🌐 Calling AI via backend proxy (attempt ${attempt + 1}/${retries})...`);

            const response = await fetch(`${API_BASE_URL}/ai/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    apiKey,
                    maxTokens
                })
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Check if model is loading (503 error)
                if (response.status === 503 || (errorData.details && errorData.details.includes('loading'))) {
                    const waitTime = (attempt + 1) * 5;
                    console.log(`Model is loading. Waiting ${waitTime} seconds before retry ${attempt + 1}/${retries}...`);
                    await delay(waitTime * 1000);
                    continue;
                }

                // Check for authentication errors
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid API key. Please check your Hugging Face API key.');
                }

                throw new Error(errorData.error || `API error (${response.status})`);
            }

            const data = await response.json();
            console.log('✅ AI response received');

            return data.generatedText;

        } catch (error) {
            // If it's a network error (Failed to fetch), provide helpful message
            if (error.message === 'Failed to fetch') {
                if (attempt < retries - 1) {
                    console.log(`Network error. Retrying ${attempt + 1}/${retries}...`);
                    await delay((attempt + 1) * 2000); // Exponential backoff
                    continue;
                }
                throw new Error('Network error: Unable to reach backend API. Please make sure the server is running.');
            }

            // If we're out of retries, throw the error
            if (attempt === retries - 1) {
                console.error('AI API call failed after retries:', error);
                throw error;
            }

            // Otherwise, retry with exponential backoff
            console.log(`Attempt ${attempt + 1} failed. Retrying...`);
            await delay((attempt + 1) * 1000);
        }
    }
};

// Get or prompt for API key
export const ensureApiKey = () => {
    let apiKey = loadApiKey();

    console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 6)}...` : 'NOT FOUND');

    if (!apiKey) {
        apiKey = prompt(
            'Please enter your Hugging Face API key.\n\n' +
            'Get a free API key from: https://huggingface.co/settings/tokens\n\n' +
            'Your key will be stored locally in your browser.'
        );

        if (!apiKey) {
            console.error('❌ No API key provided');
            return null;
        }

        saveApiKey(apiKey);
        console.log('✅ API Key saved to localStorage');
    }

    return apiKey;
};

// Prioritize tasks using AI
export const prioritizeTasks = async (tasks) => {
    try {
        const apiKey = ensureApiKey();
        if (!apiKey) {
            throw new Error('API key required');
        }

        // Filter active tasks
        const activeTasks = tasks.filter(t => !t.completed);

        if (activeTasks.length === 0) {
            return { prioritizedTasks: tasks, reasoning: 'No active tasks to prioritize' };
        }

        // Create task summary for AI
        const taskSummary = activeTasks.map((task, index) => ({
            index,
            id: task.id,
            title: task.title,
            description: task.description || 'No description',
            currentPriority: task.priority,
            dueDate: task.dueDate || 'No due date',
            createdAt: task.createdAt
        }));

        const prompt = `<s>[INST] You are an AI task prioritization assistant. Analyze these tasks and suggest optimal priority levels.

Tasks:
${JSON.stringify(taskSummary, null, 2)}

Priority levels: urgent, high, medium, low

Consider:
1. Due dates and urgency
2. Task complexity (based on description)
3. Current priority
4. Creation date

Respond with ONLY a valid JSON object in this exact format (no additional text):
{
  "priorities": [
    {"id": "task_id", "priority": "urgent|high|medium|low", "reason": "brief reason"}
  ],
  "summary": "Overall prioritization strategy"
} [/INST]`;

        const aiResponse = await callHuggingFaceAPI(apiKey, prompt);

        // Parse AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        const parsedResponse = JSON.parse(jsonMatch[0]);

        // Apply AI priorities
        const prioritizedTasks = tasks.map(task => {
            if (task.completed) return task;

            const aiPriority = parsedResponse.priorities.find(p => p.id === task.id);
            if (aiPriority) {
                return {
                    ...task,
                    aiPriority: aiPriority.priority,
                    aiReason: aiPriority.reason
                };
            }
            return task;
        });

        return {
            prioritizedTasks,
            reasoning: parsedResponse.summary,
            details: parsedResponse.priorities
        };

    } catch (error) {
        console.error('Error prioritizing tasks:', error);
        throw new Error(`Failed to prioritize tasks: ${error.message}`);
    }
};

// Get productivity insights
export const getProductivityInsights = async (tasks) => {
    try {
        const apiKey = ensureApiKey();
        if (!apiKey) {
            throw new Error('API key required');
        }

        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const overdue = tasks.filter(t =>
            !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        // Priority distribution
        const priorityDist = {
            urgent: tasks.filter(t => !t.completed && t.priority === PRIORITY.URGENT).length,
            high: tasks.filter(t => !t.completed && t.priority === PRIORITY.HIGH).length,
            medium: tasks.filter(t => !t.completed && t.priority === PRIORITY.MEDIUM).length,
            low: tasks.filter(t => !t.completed && t.priority === PRIORITY.LOW).length
        };

        const prompt = `<s>[INST] You are a productivity coach AI. Analyze this task data and provide actionable insights.

Statistics:
- Total tasks: ${total}
- Completed: ${completed}
- Active: ${active}
- Overdue: ${overdue}
- Completion rate: ${total > 0 ? Math.round((completed / total) * 100) : 0}%

Active tasks by priority:
- Urgent: ${priorityDist.urgent}
- High: ${priorityDist.high}
- Medium: ${priorityDist.medium}
- Low: ${priorityDist.low}

Provide insights in ONLY valid JSON format (no additional text):
{
  "completionAnalysis": "Analysis of completion rate and patterns",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "focusAreas": [
    "Priority area 1",
    "Priority area 2"
  ],
  "motivationalTip": "Encouraging message"
} [/INST]`;

        const aiResponse = await callHuggingFaceAPI(apiKey, prompt);

        // Parse AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        const insights = JSON.parse(jsonMatch[0]);

        return {
            ...insights,
            statistics: {
                total,
                completed,
                active,
                overdue,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
            }
        };

    } catch (error) {
        console.error('Error getting insights:', error);
        throw new Error(`Failed to generate insights: ${error.message}`);
    }
};

// Generate task suggestions
export const generateTaskSuggestions = async (taskTitle) => {
    try {
        const apiKey = ensureApiKey();
        if (!apiKey) {
            throw new Error('API key required');
        }

        const prompt = `<s>[INST] You are a task planning assistant. Given this task: "${taskTitle}"

Suggest:
1. A more detailed description
2. 2-3 subtasks to break it down
3. Estimated priority level

Respond with ONLY valid JSON (no additional text):
{
  "description": "Detailed description",
  "subtasks": ["subtask 1", "subtask 2"],
  "suggestedPriority": "urgent|high|medium|low"
} [/INST]`;

        const aiResponse = await callHuggingFaceAPI(apiKey, prompt, 1000);

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error('Error generating suggestions:', error);
        throw new Error(`Failed to generate suggestions: ${error.message}`);
    }
};
