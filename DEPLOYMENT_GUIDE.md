# Deploying AI-Powered Task Manager to Render

This guide will walk you through deploying your AI-powered Task Manager application to Render with a MongoDB Atlas database.

## Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account (sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- Gemini API key (get from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))

---

## Step 1: Set Up MongoDB Atlas

> [!IMPORTANT]
> You need a cloud MongoDB database for production. MongoDB Atlas offers a free tier perfect for this project.

### 1.1 Create a MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in
2. Click **"Build a Database"**
3. Choose **"M0 FREE"** tier
4. Select your preferred cloud provider and region
5. Click **"Create Cluster"**

### 1.2 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password (save these securely!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Whitelist IP Addresses

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
5. Replace `<password>` with your actual database user password
6. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/task-manager`

---

## Step 2: Push Code to GitHub

> [!NOTE]
> Render deploys from GitHub repositories, so your code needs to be on GitHub.

### 2.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - AI Task Manager"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `ai-task-manager` (or your preferred name)
3. Don't initialize with README (since you already have code)

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-task-manager.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend API to Render

### 3.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your `ai-task-manager` repository
5. Configure the service:

**Basic Settings:**
- **Name**: `ai-task-manager-api`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** tier

### 3.2 Add Environment Variables

Scroll down to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1.4 |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |

### 3.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://ai-task-manager-api.onrender.com`)

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Select your `ai-task-manager` repository
4. Configure the site:

**Basic Settings:**
- **Name**: `ai-task-manager`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty (root of repo)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4.2 Add Environment Variables

Add these environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your backend URL from Step 3.3 + `/api` (e.g., `https://ai-task-manager-api.onrender.com/api`) |
| `VITE_GEMINI_API_KEY` | Your Gemini API key |

> [!IMPORTANT]
> **CRITICAL**: The `VITE_API_URL` MUST end with `/api`.
> - ❌ Incorrect: `https://ai-task-manager-api.onrender.com`
> - ✅ Correct: `https://ai-task-manager-api.onrender.com/api`
> If you miss the `/api` suffix, the frontend will get 404 errors (HTML responses) when trying to reach the backend.

### 4.3 Configure Redirects

1. After creating the static site, go to **"Redirects/Rewrites"**
2. Add a rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

### 4.4 Deploy

1. Click **"Create Static Site"**
2. Wait for deployment to complete (5-10 minutes)
3. Your app will be live at `https://ai-task-manager.onrender.com` (or your chosen name)

---

## Step 5: Verify Deployment

### 5.1 Test Backend API

Visit your backend URL in a browser:
```
https://ai-task-manager-api.onrender.com
```

You should see:
```json
{
  "message": "AI Task Manager API is running!"
}
```

### 5.2 Test Frontend

1. Visit your frontend URL: `https://ai-task-manager.onrender.com`
2. Create a test task
3. Try AI features (prioritization, insights)
4. Verify tasks are saved (refresh the page)

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Verify your MongoDB Atlas connection string is correct
- Check that IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

**API Not Responding:**
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Ensure `PORT` is set to `10000`

### Frontend Issues

**Can't Connect to Backend:**
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend is running and accessible
- Look at browser console for CORS errors

**AI Features Not Working:**
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check browser console for API errors
- Ensure you have a valid Gemini API key

**404 on Page Refresh:**
- Verify redirect/rewrite rule is configured
- Should rewrite `/*` to `/index.html`

---

## Free Tier Limitations

> [!WARNING]
> Render's free tier has some limitations to be aware of:

- **Backend**: Spins down after 15 minutes of inactivity (first request after may take 30-60 seconds)
- **Database**: MongoDB Atlas free tier has 512MB storage limit
- **Build Minutes**: 500 minutes per month for free tier

---

## Custom Domain (Optional)

To use a custom domain:

1. Go to your static site settings
2. Click **"Custom Domains"**
3. Add your domain
4. Update your domain's DNS settings as instructed
5. Wait for SSL certificate to be issued

---

## Environment Variables Reference

### Backend (`server/.env`)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
PORT=10000
NODE_ENV=production
```

### Frontend (root `.env.local`)
```env
VITE_API_URL=https://ai-task-manager-api.onrender.com/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Next Steps

- ✅ Monitor your app's performance in Render Dashboard
- ✅ Set up automatic deployments (enabled by default on `main` branch)
- ✅ Consider upgrading to paid tier for always-on backend
- ✅ Add more features and push to GitHub to auto-deploy

---

## Support

If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables are correct
3. Test backend API endpoint directly
4. Check browser console for frontend errors

Happy deploying! 🚀
