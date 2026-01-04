# AI Task Manager - Troubleshooting Guide

## Current Status

✅ **Frontend**: Running on http://localhost:5173  
⚠️ **Backend**: Running on http://localhost:5000 (but MongoDB not connected)  
❌ **AI Features**: May fail due to missing Hugging Face API key

---

## Issue 1: MongoDB Connection Error

### Problem
The backend cannot connect to MongoDB Atlas. The error message indicates:
```
Could not connect to any servers in your MongoDB Atlas cluster
```

### Solutions

#### Option A: Use Local MongoDB (Recommended for Development)
1. Install MongoDB locally from: https://www.mongodb.com/try/download/community
2. Update `server/.env` to use local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/task-manager
   PORT=5000
   ```
3. Restart the server (it will auto-restart with nodemon)

#### Option B: Fix MongoDB Atlas Connection
1. Go to your MongoDB Atlas dashboard: https://cloud.mongodb.com/
2. Click on "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Either:
   - Click "Add Current IP Address" to whitelist your current IP
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) for testing ⚠️
5. Save and wait a few minutes for the changes to take effect
6. The server will auto-reconnect

---

## Issue 2: AI Features "Failed to Fetch" Error

### Problem
The AI suggestions feature is failing with "Failed to fetch" error.

### Root Cause
Missing or invalid Hugging Face API key.

### Solution

#### Step 1: Get a Free Hugging Face API Key
1. Go to: https://huggingface.co/settings/tokens
2. Sign up/login if needed
3. Click "New token"
4. Give it a name (e.g., "Task Manager")
5. Select "Read" access
6. Copy the generated token

#### Step 2: Add API Key to Your App

You have two options:

**Option A: Store in Browser (Recommended)**
1. Open your app at http://localhost:5173
2. Try to use an AI feature (AI Suggestions button)
3. A popup will ask for your API key
4. Paste your key and it will be saved in localStorage

**Option B: Add to Environment File**
1. Open `.env.local` in the project root
2. Add your key:
   ```
   VITE_HUGGINGFACE_API_KEY=hf_your_actual_key_here
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart the frontend server

---

## What I Fixed

### 1. Enhanced AI Service (`src/services/aiService.js`)
- ✅ Added retry logic for network failures
- ✅ Handles Hugging Face model "cold start" (503 errors)
- ✅ Better error messages for debugging
- ✅ Exponential backoff for retries
- ✅ Clearer authentication error messages

### 2. Improved Backend (`server/index.js`)
- ✅ Server now continues running even if MongoDB fails
- ✅ Displays helpful error messages
- ✅ AI features can still work without database

---

## Testing the Fixes

### Test AI Features:
1. Make sure you have a Hugging Face API key configured
2. Create a new task with just a title
3. Click the "Get AI Suggestions" button (✨ icon)
4. The improved service will:
   - Retry on failures
   - Wait if model is loading
   - Show clear error messages

### Expected Behavior:
- First AI request might take 10-20 seconds (model loading)
- Subsequent requests should be faster
- You'll see retry messages in the console if there are issues

---

## Current Workaround

Since MongoDB is not connected, you can:
1. **Use AI features**: These work directly with Hugging Face (no database needed)
2. **Task storage won't persist**: Tasks are lost on page refresh without MongoDB

To get full functionality, fix the MongoDB connection using the solutions above.

---

## Quick Start Commands

```bash
# Check if MongoDB is running locally
mongosh

# Restart servers (from project root)
npm run start

# View backend logs
# (Already running in your current terminal)

# View frontend
# Open http://localhost:5173 in your browser
```

---

## Need Help?

1. **MongoDB Issues**: Check `server/.env` file has the correct `MONGODB_URI`
2. **AI Issues**: Verify your Hugging Face API key is valid
3. **Network Issues**: Check your internet connection
4. **Browser Console**: Press F12 and check the Console tab for detailed errors
