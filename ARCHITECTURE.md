# 📋 System Design & Architecture

This document outlines the complete system design of the Hackathon Evaluation Portal.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Components, Pages, Context, Services              │   │
│  │ Tailwind CSS, Chart.js, React Router              │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ Axios API Calls
                           │ JWT Bearer Token
                           ▼
┌─────────────────────────────────────────────────────────┐
│                SERVER (Express.js)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes → Controllers → Middleware → Services     │   │
│  │ Authentication, Authorization, Error Handling    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Users, Hackathons, Teams, Submissions, etc       │   │
│  │ Collections with indexes for performance          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Application Flow

### Authentication Flow
```
User Input (Email/Password)
        ↓
Register/Login Request → Server
        ↓
Hash Password / Verify Password
        ↓
Generate JWT Token
        ↓
Send Token to Client
        ↓
Store in localStorage
        ↓
Include in Authorization Header for Future Requests
```

### Request Flow
```
Client Request with JWT Token
        ↓
Express Middleware (protect)
        ↓
Verify JWT Token
        ↓
Authorize by Role (authorize middleware)
        ↓
Route Handler (Controller)
        ↓
Database Query (Mongoose)
        ↓
Response to Client
```

## Data Models & Relationships

### User
- One user can create multiple teams (as leader)
- One user can be member of multiple teams
- One user can be assigned as judge to multiple teams
- One user can submit multiple feedbacks

### Hackathon
- One hackathon has multiple teams
- One hackathon has multiple judges
- One hackathon has custom evaluation criteria
- One hackathon has multiple submissions

### Team
- One team belongs to one hackathon
- One team has one leader
- One team has multiple members
- One team can be assigned multiple judges
- One team has one submission

### Submission
- One submission belongs to one team
- One submission belongs to one hackathon
- One submission has multiple evaluations
- One submission can have multiple files

### Evaluation
- One evaluation belongs to one submission
- One evaluation belongs to one judge
- One evaluation contains multiple scores

### Feedback
- One feedback belongs to one hackathon
- One feedback belongs to one user
- Optional link to a team

## Key Features Implementation

### 1. Authentication & Authorization
- **Implementation**: JWT-based
- **Storage**: localStorage (client), verified on every request
- **Middleware**: Protect (verify token), Authorize (check role)
- **Roles**: Admin, Judge, Student

### 2. Team Management
- **Join Code**: Unique, auto-generated 8-character code
- **Leader**: Creates team, can manage members
- **Members**: Can be added/removed by leader
- **Status**: Active, Inactive, Disqualified

### 3. Submission System
- **Deadline Tracking**: Automatic late detection
- **Status**: Draft, Submitted, Approved, Rejected
- **Late Submissions**: Can be approved by admin
- **Content**: Files, links, videos, code

### 4. Evaluation System
- **Multi-Judge**: Multiple judges per submission
- **Scoring**: Dynamic criteria from hackathon
- **Feedback**: Structured (strengths, improvements, general)
- **Approval**: Admin approves evaluations

### 5. Analytics
- **Rankings**: Based on average score
- **Statistics**: Teams, submissions, evaluations
- **Charts**: Using Chart.js/Recharts
- **Feedback Analytics**: Ratings distribution by category

## API Endpoints Summary

### Authentication (7 endpoints)
- POST /register
- POST /login
- GET /me
- PUT /profile

### Hackathons (6 endpoints)
- GET / (all)
- POST / (create)
- GET /:id
- PUT /:id
- DELETE /:id
- POST /:id/judges

### Teams (7 endpoints)
- GET /
- POST /
- GET /:id
- PUT /:id
- POST /join/:joinCode
- POST /:id/remove-member
- POST /:id/assign-judges

### Submissions (5 endpoints)
- GET /
- POST /
- GET /:id
- PUT /:id/status
- PUT /:id/approve-late

### Evaluations (6 endpoints)
- POST /
- GET /submission/:submissionId
- GET /team/:teamId
- GET /judge/assignments
- GET / (hackathon)
- PUT /:id/approve

### Feedback (3 endpoints)
- POST /
- GET / (hackathon)
- GET /analytics/:hackathonId

### Analytics (3 endpoints)
- GET /rankings/:hackathonId
- GET /team/:teamId
- GET /hackathon/:hackathonId/stats

**Total: 38 RESTful endpoints**

## Database Schema Details

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/judge/student),
  institution: String,
  phone: String,
  avatar: String (URL),
  bio: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Hackathon Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  submissionDeadline: Date,
  evaluationDeadline: Date,
  location: String,
  mode: String (online/offline/hybrid),
  image: String,
  maxTeamSize: Number,
  maxTeams: Number,
  theme: String,
  prize: String,
  status: String,
  createdBy: ObjectId (ref: User),
  judges: [ObjectId] (ref: User),
  evaluationCriteria: [
    { name: String, maxScore: Number, description: String }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Team Collection
```javascript
{
  _id: ObjectId,
  teamName: String,
  description: String,
  hackathon: ObjectId (ref: Hackathon),
  leader: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  assignedJudges: [ObjectId] (ref: User),
  logo: String,
  joinCode: String (unique),
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Submission Collection
```javascript
{
  _id: ObjectId,
  team: ObjectId (ref: Team),
  hackathon: ObjectId (ref: Hackathon),
  title: String,
  description: String,
  files: [
    { filename: String, url: String, fileType: String, uploadedAt: Date }
  ],
  videoUrl: String,
  githubLink: String,
  liveLink: String,
  submittedAt: Date,
  isLate: Boolean,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Evaluation Collection
```javascript
{
  _id: ObjectId,
  submission: ObjectId (ref: Submission),
  hackathon: ObjectId (ref: Hackathon),
  team: ObjectId (ref: Team),
  judge: ObjectId (ref: User),
  scores: [
    { criteriaName: String, score: Number }
  ],
  totalScore: Number,
  feedback: String,
  strengths: String,
  improvements: String,
  status: String,
  isApproved: Boolean,
  rejectionReason: String,
  evaluatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Collection
```javascript
{
  _id: ObjectId,
  hackathon: ObjectId (ref: Hackathon),
  user: ObjectId (ref: User),
  team: ObjectId (ref: Team),
  rating: Number (1-5),
  category: String,
  comment: String,
  suggestions: String,
  isAnonymous: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Measures

### 1. Authentication
- JWT tokens with expiration
- Password hashing using bcryptjs (salt rounds: 10)
- Token stored in localStorage

### 2. Authorization
- Role-based access control (RBAC)
- Middleware checks before accessing resources
- User can only modify own resources

### 3. Data Validation
- Input validation on both client and server
- Mongoose schema validation
- Sanitization of user input

### 4. API Security
- CORS enabled for local development
- Error messages don't expose sensitive info
- Database errors caught and handled

### 5. Password Security
- Minimum 6 characters
- Hashed before storage
- Never returned in responses

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (email, hackathon, team, user)
- Population of references only when needed
- Pagination support (not yet implemented)

### Frontend Optimization
- React functional components with hooks
- Context API for state management
- Lazy loading of pages (can be added)

### Caching Strategies
- localStorage for auth tokens
- Browser cache for static assets

## Scalability

### Current Limitations
- Single MongoDB instance
- No caching layer (Redis)
- No database replication

### Future Improvements
- Add Redis for caching
- Implement pagination
- Add rate limiting
- CDN for static assets
- Database sharding for large datasets

## Testing Strategy

### Unit Tests
- Controller logic
- Utility functions
- Helper functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User registration
- Team creation
- Submission flow
- Evaluation process

## Deployment Architecture

### Backend Deployment
- Node.js server on cloud platform
- MongoDB Atlas for database
- Environment variables for configuration

### Frontend Deployment
- Build React app: `npm run build`
- Deploy dist/ folder to CDN or web server
- Environment variables for API URL

### Example (AWS)
- Backend: EC2 or Elastic Beanstalk
- Database: MongoDB Atlas
- Frontend: S3 + CloudFront
- API Gateway: API Gateway

## Error Handling

### Client-Side
- Alert component for user messages
- Console logging for debugging
- Graceful error messages

### Server-Side
- Centralized error middleware
- Proper HTTP status codes
- Detailed error logging

## Future Enhancements

1. **File Upload**: Integration with Cloudinary or AWS S3
2. **Real-time Notifications**: Socket.io for live updates
3. **Email Notifications**: Send notifications to users
4. **Advanced Search**: Full-text search with filters
5. **Mobile App**: React Native version
6. **Leaderboard**: Live rankings with animations
7. **Video Submission**: Video upload and playback
8. **Payment Integration**: For premium features
9. **Social Features**: Comments, discussions
10. **AI Integration**: Auto-scoring assistance

---

**Last Updated:** 2024
