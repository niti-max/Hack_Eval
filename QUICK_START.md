# 🚀 Quick Start Guide - HackEval Portal

This guide will help you set up and run the Hackathon Evaluation Portal in minutes.

## Prerequisites

Before you begin, make sure you have:
- **Node.js** v14+ installed ([Download](https://nodejs.org/))
- **MongoDB** installed locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** installed (optional, for version control)
- A code editor (VS Code recommended)

## Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd Hack_Eval
```

## Step 2: Backend Setup

### 2.1 Navigate to server directory
```bash
cd server
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 Create environment file
```bash
cp .env.example .env
```

### 2.4 Configure MongoDB
Edit `.env` and set:

**For Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/hackathon_portal
```

**For MongoDB Atlas (Cloud):**
1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Add it to `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/hackathon_portal
```

### 2.5 Configure JWT Secret
Edit `.env` and add:
```
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 2.6 Start the backend server
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
Environment: development
```

✅ Backend is ready!

## Step 3: Frontend Setup

### 3.1 Open a new terminal and navigate to client directory
```bash
cd client
```

### 3.2 Install dependencies
```bash
npm install
```

### 3.3 Create environment file
```bash
cp .env.example .env
```

### 3.4 Ensure API URL is correct
The `.env` should contain:
```
VITE_API_URL=http://localhost:5000/api
```

### 3.5 Start the development server
```bash
npm run dev
```

You should see:
```
VITE v7.2.4  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ Frontend is ready!

## Step 4: Access the Application

Open your browser and go to: **http://localhost:5173**

## Step 5: Test the Application

### Test with Demo Credentials:

1. **Click on "Login"** or navigate to `/login`

2. **Use one of these demo accounts:**
   - **Admin**: admin@example.com / password123
   - **Judge**: judge@example.com / password123
   - **Student**: student@example.com / password123

3. Or **Register a new account** via the `/register` page

## 🎯 What to Try First

### As Admin:
1. ✅ Login as admin
2. ✅ Go to `/admin/dashboard`
3. ✅ Create a new hackathon event
4. ✅ View statistics and analytics

### As Judge:
1. ✅ Login as judge
2. ✅ Go to `/judge/evaluations`
3. ✅ View assigned teams
4. ✅ Evaluate submissions

### As Student:
1. ✅ Login as student
2. ✅ Go to `/student/teams`
3. ✅ Create a new team
4. ✅ Join a hackathon event

## 📁 Project Structure Quick Reference

```
Hack_Eval/
├── server/           # Backend (Node.js + Express)
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, error handling
│   └── server.js     # Entry point
│
└── client/           # Frontend (React)
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/  # Reusable components
    │   ├── context/  # Global state (Auth)
    │   ├── services/ # API calls
    │   └── App.jsx   # Main app component
    └── vite.config.js
```

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
- Ensure MongoDB is running locally: `mongod`
- Or verify MongoDB Atlas connection string in `.env`
- Check firewall settings if using Atlas

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in server/.env to 5001 (or any available port)
PORT=5001
```

### Issue: CORS Errors
**Solution:**
- Ensure both frontend (5173) and backend (5000) are running
- Check VITE_API_URL in client/.env matches backend URL

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📱 Available Routes

### Public Routes:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Admin Routes:
- `/admin/dashboard` - Analytics & statistics

### Judge Routes:
- `/judge/evaluations` - View evaluations

### Student Routes:
- `/student/teams` - Manage teams

## 🛠️ Development Tips

### Hot Reload:
- Frontend: Changes auto-reload thanks to Vite
- Backend: Changes auto-reload thanks to nodemon

### API Testing:
Use Postman or Thunder Client to test endpoints:
1. Start by registering: `POST http://localhost:5000/api/auth/register`
2. Then login: `POST http://localhost:5000/api/auth/login`
3. Use the token for authenticated requests

### Database Inspection:
- **MongoDB Compass**: Visual database browser
- **MongoDB Atlas UI**: In-browser database console

## 🚀 Production Build

### Frontend:
```bash
cd client
npm run build
# Output in dist/ folder
```

### Backend:
```bash
cd server
NODE_ENV=production npm start
```

## 📚 Next Steps

1. ✅ Explore the admin dashboard
2. ✅ Create your first hackathon event
3. ✅ Test the team creation flow
4. ✅ Try the evaluation system
5. ✅ Review the analytics dashboard

## 📖 Full Documentation

See [README.md](./README.md) for:
- Complete API documentation
- Database schema details
- Feature list
- Troubleshooting guide

## 💡 Tips

- **Bookmark demo credentials** - You'll use them often
- **Keep two terminals open** - One for backend, one for frontend
- **Check browser console** - Errors are logged there
- **MongoDB Compass** - Great for inspecting your database

## 🎉 You're All Set!

Your Hackathon Evaluation Portal is now ready to use!

### Need Help?
1. Check the browser console for errors (F12)
2. Check terminal output for API errors
3. Review the README.md for detailed documentation
4. Check the `.env` files are properly configured

---

**Happy Hacking! 🚀**
