import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    priority: {
        type: String,
        enum: ['urgent', 'high', 'medium', 'low'],
        default: 'medium'
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: null
    },
    aiPriority: {
        type: String,
        enum: ['urgent', 'high', 'medium', 'low'],
        default: null
    },
    aiReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
