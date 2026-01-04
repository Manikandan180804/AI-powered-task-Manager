import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('\n⚠️  Server will continue running but database operations will fail.');
        console.log('💡 To fix this issue:');
        console.log('   1. Check your MongoDB connection string in server/.env');
        console.log('   2. If using MongoDB Atlas, whitelist your IP address');
        console.log('   3. Or use a local MongoDB instance: mongodb://localhost:27017/task-manager\n');
        // Don't exit - let server run for AI features to work
    }
};

// Connect to MongoDB (non-blocking)
connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'AI Task Manager API is running!' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`⏰ Server started at: ${new Date().toLocaleTimeString()}`);
});
