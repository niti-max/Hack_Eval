# Hackathon Evaluation Portal - Backend
Backend server for the Hackathon Evaluation Portal built with Node.js, Express, and MongoDB.

## Features
- User authentication with JWT
- Role-based access control (Admin, Judge, Student)
- Hackathon management
- Team creation and management
- Submission handling
- Evaluation system with multiple judges
- Feedback collection
- Analytics and rankings
- Real-time data with MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Environment (development/production)

4. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Hackathon Endpoints
- `GET /api/hackathons` - Get all hackathons
- `POST /api/hackathons` - Create hackathon (Admin only)
- `GET /api/hackathons/:id` - Get specific hackathon
- `PUT /api/hackathons/:id` - Update hackathon (Admin only)
- `DELETE /api/hackathons/:id` - Delete hackathon (Admin only)
- `POST /api/hackathons/:id/judges` - Add judges (Admin only)

### Team Endpoints
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get specific team
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/join/:joinCode` - Join team
- `POST /api/teams/:id/remove-member` - Remove team member
- `POST /api/teams/:id/assign-judges` - Assign judges (Admin only)

### Submission Endpoints
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Create/update submission
- `GET /api/submissions/:id` - Get specific submission
- `PUT /api/submissions/:id/status` - Update status (Admin only)
- `PUT /api/submissions/:id/approve-late` - Approve late submission (Admin only)

### Evaluation Endpoints
- `POST /api/evaluations` - Create evaluation
- `GET /api/evaluations/submission/:submissionId` - Get submission evaluations
- `GET /api/evaluations/team/:teamId` - Get team evaluations
- `GET /api/evaluations/judge/assignments` - Get judge's evaluations
- `PUT /api/evaluations/:id/approve` - Approve evaluation (Admin only)

### Feedback Endpoints
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get hackathon feedback (Admin only)
- `GET /api/feedback/analytics/:hackathonId` - Get feedback analytics (Admin only)

### Analytics Endpoints
- `GET /api/analytics/rankings/:hackathonId` - Get rankings
- `GET /api/analytics/team/:teamId` - Get team analytics
- `GET /api/analytics/hackathon/:hackathonId/stats` - Get hackathon stats (Admin only)

## Database Schema

### User
```javascript
{
  name, email, password, role, institution, phone, avatar, bio, isActive, timestamps
}
```

### Hackathon
```javascript
{
  title, description, startDate, endDate, submissionDeadline, evaluationDeadline,
  location, mode, image, maxTeamSize, maxTeams, theme, prize, status,
  createdBy, judges, evaluationCriteria, timestamps
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
  team, hackathon, title, description, files, videoUrl, githubLink, liveLink,
  submittedAt, isLate, status, timestamps
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
  hackathon, user, team, rating, category, comment, suggestions, isAnonymous, timestamps
}
```

## Error Handling
The API returns standardized error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Middleware
- **Authentication**: JWT token verification
- **Authorization**: Role-based access control
- **Error Handler**: Centralized error handling
