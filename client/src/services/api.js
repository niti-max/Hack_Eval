import axiosInstance from './axiosConfig';

// Auth endpoints
export const authService = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  getProfile: () => axiosInstance.get('/auth/me'),
  getUsers: (role) => axiosInstance.get('/auth/users', { params: { role } }),
  updateProfile: (userData) => axiosInstance.put('/auth/profile', userData),
};

// Hackathon endpoints
export const hackathonService = {
  getAll: (status) => axiosInstance.get('/hackathons', { params: { status } }),
  getById: (id) => axiosInstance.get(`/hackathons/${id}`),
  create: (data) => axiosInstance.post('/hackathons', data),
  update: (id, data) => axiosInstance.put(`/hackathons/${id}`, data),
  delete: (id) => axiosInstance.delete(`/hackathons/${id}`),
  addJudges: (id, judgeIds) => axiosInstance.post(`/hackathons/${id}/judges`, { judgeIds }),
};

// Team endpoints
export const teamService = {
  getAll: (hackathonId) => axiosInstance.get('/teams', { params: { hackathonId } }),
  getById: (id) => axiosInstance.get(`/teams/${id}`),
  create: (data) => axiosInstance.post('/teams', data),
  update: (id, data) => axiosInstance.put(`/teams/${id}`, data),
  joinByCode: (joinCode) => axiosInstance.post(`/teams/join/${joinCode}`),
  removeMember: (id, memberId) => axiosInstance.post(`/teams/${id}/remove-member`, { memberId }),
  assignJudges: (id, judgeIds) => axiosInstance.post(`/teams/${id}/assign-judges`, { judgeIds }),
};

// Submission endpoints
export const submissionService = {
  getAll: (hackathonId, status) => axiosInstance.get('/submissions', { params: { hackathonId, status } }),
  getById: (id) => axiosInstance.get(`/submissions/${id}`),
  getTeamSubmissions: (teamId) => axiosInstance.get(`/submissions/team/${teamId}`),
  create: (data) => axiosInstance.post('/submissions', data),
  updateStatus: (id, status) => axiosInstance.put(`/submissions/${id}/status`, { status }),
  approveLate: (id) => axiosInstance.put(`/submissions/${id}/approve-late`),
};

// Evaluation endpoints
export const evaluationService = {
  create: (data) => axiosInstance.post('/evaluations', data),
  getSubmissionEvals: (submissionId) => axiosInstance.get(`/evaluations/submission/${submissionId}`),
  getTeamEvals: (teamId) => axiosInstance.get(`/evaluations/team/${teamId}`),
  getJudgeAssignments: () => axiosInstance.get('/evaluations/judge/assignments'),
  getHackathonEvals: (hackathonId) => axiosInstance.get('/evaluations', { params: { hackathonId } }),
  approve: (id, data) => axiosInstance.put(`/evaluations/${id}/approve`, data),
};

// Feedback endpoints
export const feedbackService = {
  create: (data) => axiosInstance.post('/feedback', data),
  getHackathonFeedback: (hackathonId, category) => axiosInstance.get('/feedback', { params: { hackathonId, category } }),
  getAnalytics: (hackathonId) => axiosInstance.get(`/feedback/analytics/${hackathonId}`),
};

// Analytics endpoints
export const analyticsService = {
  getRankings: (hackathonId) => axiosInstance.get(`/analytics/rankings/${hackathonId}`),
  getTeamAnalytics: (teamId) => axiosInstance.get(`/analytics/team/${teamId}`),
  getHackathonStats: (hackathonId) => axiosInstance.get(`/analytics/hackathon/${hackathonId}/stats`),
};
