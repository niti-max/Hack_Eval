# Hackathon Evaluation Portal - Complete MERN Stack Application

A comprehensive web-based platform for managing hackathon events, participant registrations, submissions, evaluations, feedback, and analytics.

## 🎯 Project Overview

HackEval Portal is a full-stack MERN application designed to streamline hackathon management with the following key capabilities:

- **Event Management**: Create and manage multiple hackathon events
- **User Roles**: Support for Admin, Judge, and Student roles
- **Team Management**: Create teams, invite members using join codes
- **Submissions**: Upload project files, links, and videos
- **Evaluations**: Multi-judge evaluation system with scoring criteria
- **Analytics**: Real-time rankings, performance metrics, and feedback analytics
- **Deadline Tracking**: Automatic late submission detection and management
- **Feedback System**: Collect and analyze event feedback with ratings

## 📋 Technology Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Chart.js** - Analytics and charts
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Hack_Eval/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Hackathon.js
│   │   ├── Team.js
│   │   ├── Submission.js
│   │   ├── Evaluation.js
│   │   └── Feedback.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hackathonController.js
│   │   ├── teamController.js
│   │   ├── submissionController.js
│   │   ├── evaluationController.js
│   │   ├── feedbackController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hackathonRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── submissionRoutes.js
│   │   ├── evaluationRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Loading.jsx
    │   │   ├── Alert.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── JudgeDashboard.jsx
    │   │   └── StudentDashboard.jsx
    │   ├── services/
    │   │   ├── axiosConfig.js
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB**
   - For local MongoDB:
     ```
     MONGO_URI=mongodb://localhost:27017/hackathon_portal
     ```
   - For MongoDB Atlas:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_portal
     ```

5. **Set JWT Secret**
   ```
   JWT_SECRET=your_secure_random_secret_key_here
   ```

6. **Start the server**
   ```bash
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure API URL** (if different from default)
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will start on `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Hackathons
- `GET /api/hackathons` - Get all hackathons
- `POST /api/hackathons` - Create new hackathon (Admin)
- `GET /api/hackathons/:id` - Get specific hackathon
- `PUT /api/hackathons/:id` - Update hackathon (Admin)
- `DELETE /api/hackathons/:id` - Delete hackathon (Admin)
- `POST /api/hackathons/:id/judges` - Add judges (Admin)

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get specific team
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/join/:joinCode` - Join team
- `POST /api/teams/:id/remove-member` - Remove member
- `POST /api/teams/:id/assign-judges` - Assign judges (Admin)

### Submissions
- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions/:id` - Get specific submission
- `PUT /api/submissions/:id/status` - Update status (Admin)

### Evaluations
- `POST /api/evaluations` - Create evaluation (Judge)
- `GET /api/evaluations/submission/:submissionId` - Get submission evaluations
- `GET /api/evaluations/team/:teamId` - Get team evaluations
- `GET /api/evaluations/judge/assignments` - Get judge assignments (Judge)

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get hackathon feedback (Admin)
- `GET /api/feedback/analytics/:hackathonId` - Get feedback analytics (Admin)

### Analytics
- `GET /api/analytics/rankings/:hackathonId` - Get team rankings
- `GET /api/analytics/team/:teamId` - Get team analytics
- `GET /api/analytics/hackathon/:hackathonId/stats` - Get hackathon stats (Admin)

## 👥 User Roles

### Admin
- Create and manage hackathon events
- Manage users and assignments
- Assign judges to teams/hackathons
- View all submissions and analytics
- Approve/reject late submissions
- Approve evaluations

### Judge
- View assigned teams and submissions
- Provide scores and feedback
- Approve/reject late submissions

### Student
- Register for hackathons
- Create and manage teams
- Upload project submissions
- View scores and rankings
- Submit feedback

## 🎨 Features

### Core Features
- ✅ User authentication with JWT
- ✅ Role-based access control
- ✅ Multiple hackathon events
- ✅ Team creation with join codes
- ✅ File and link submissions
- ✅ Multi-judge evaluation system
- ✅ Real-time rankings
- ✅ Deadline countdown timer
- ✅ Late submission tracking
- ✅ Feedback analytics
- ✅ Performance charts and graphs

### Extra Features
- ✅ Judge-wise feedback display
- ✅ Submission deadline countdown
- ✅ Automatic late submission detection
- ✅ Responsive design
- ✅ Real-time analytics
- ✅ Team statistics

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. Token validated by middleware before accessing protected resources

## 🔧 Configuration

### Backend .env Variables
```
MONGO_URI=mongodb://localhost:27017/hackathon_portal
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Frontend .env Variables
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

### User
```javascript
{
  name, email, password (hashed), role, institution, phone, 
  avatar, bio, isActive, timestamps
}
```

### Hackathon
```javascript
{
  title, description, startDate, endDate, submissionDeadline,
  location, mode, image, maxTeamSize, maxTeams, theme, prize,
  status, createdBy, judges, evaluationCriteria, timestamps
}
```

### Team
```javascript
{
  teamName, description, hackathon, leader, members, assignedJudges,
  logo, joinCode, status, timestamps
}
```

### Submission
```javascript
{
  team, hackathon, title, description, files, videoUrl, githubLink,
  liveLink, submittedAt, isLate, status, timestamps
}
```

### Evaluation
```javascript
{
  submission, hackathon, team, judge, scores, totalScore, feedback,
  strengths, improvements, status, isApproved, rejectionReason, timestamps
}
```

### Feedback
```javascript
{
  hackathon, user, team, rating, category, comment, suggestions,
  isAnonymous, timestamps
}
```

## 🧪 Testing the Application

### Demo Credentials
```
Admin:
Email: admin@example.com
Password: password123

Judge:
Email: judge@example.com
Password: password123

Student:
Email: student@example.com
Password: password123
```

### Test Flow
1. Register a new account or use demo credentials
2. Login to the portal
3. (Admin) Create a hackathon event
4. (Student) Create a team and register for hackathon
5. (Student) Upload submission
6. (Admin) Assign judges to teams
7. (Judge) Evaluate submissions
8. View rankings and analytics

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify MONGO_URI in .env file

### API Connection Error
- Check if backend server is running on port 5000
- Verify VITE_API_URL in client .env

### JWT Token Issues
- Clear localStorage and login again
- Check JWT_SECRET matches between server sessions

## 📦 Building for Production

### Backend
```bash
# Set NODE_ENV to production
NODE_ENV=production npm start
```

### Frontend
```bash
npm run build
# Deploy the dist/ folder
```

## 📝 Code Quality

- Clean and modular code structure
- Comprehensive comments for complex logic
- Error handling middleware
- Input validation
- Secure password hashing with bcryptjs
- JWT-based authentication
- Role-based access control

## 🤝 Contributing

The codebase is structured for easy expansion:
- Add new models in `server/models/`
- Create new controllers in `server/controllers/`
- Add routes in `server/routes/`
- Create new pages in `client/src/pages/`
- Add reusable components in `client/src/components/`

## 📄 License

This project is provided as-is for educational and development purposes.

## 🆘 Support

For issues or questions:
1. Check the API documentation
2. Review the database schema
3. Check console for error messages
4. Verify environment variables

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
