# AI-Powered Task Manager with MongoDB

A smart task management application with AI features powered by Hugging Face and MongoDB database.

## Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- 🎯 **AI Task Prioritization**: Get intelligent priority suggestions
- 📊 **Productivity Insights**: AI-powered analysis and recommendations
- 💡 **Smart Suggestions**: AI-generated task descriptions and subtasks
- 🗄️ **MongoDB Backend**: Persistent storage across devices
- 🌙 **Modern UI**: Beautiful, responsive interface with animations

## Tech Stack

### Frontend
- React 18
- Vite
- Lucide Icons
- CSS Variables for theming

### Backend
- Node.js & Express
- MongoDB with Mongoose
- REST API

### AI
- Hugging Face Inference API
- Mistral Mixtral-8x7B model

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Hugging Face API key

## Installation

1. **Clone the repository**
   ```bash
   cd "d:\project\Ai-powered task Manager"
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create `.env.local` in the root directory:
   ```
   VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
   VITE_API_URL=http://localhost:5000/api
   ```

   Create `server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/task-manager
   PORT=5000
   ```

5. **Start MongoDB**
   - **Local MongoDB**: Make sure MongoDB is running on port 27017
   - **MongoDB Atlas**: Update `MONGODB_URI` with your Atlas connection string

## Running the Application

### Option 1: Run both servers together
```bash
npm run start
```

### Option 2: Run separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173 (or next available port)
- Backend: http://localhost:5000

## Getting API Keys

### Hugging Face API Key
1. Visit https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name and select "Read" access
4. Copy the token to your `.env.local` file

### MongoDB Atlas (Free Tier)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `server/.env`

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/bulk-update` - Bulk update tasks (for AI prioritization)

## Project Structure

```
├── server/            # Backend
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── index.js       # Server entry point
│   └── package.json
├── src/               # Frontend
│   ├── components/    # React components
│   ├── services/      # AI service
│   ├── utils/         # Utilities
│   └── App.jsx        # Main app component
├── .env.local         # Frontend environment
└── package.json       # Frontend package.json
```

## License

MIT
