import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UnifiedDashboard from './pages/UnifiedDashboard';
import CreateHackathon from './pages/CreateHackathon';
import HackathonDetails from './pages/HackathonDetails';
import JudgeEvaluationList from './pages/JudgeEvaluationList';
import TeamRegistration from './pages/TeamRegistration';
import SubmitProject from './pages/SubmitProject';
import ResultsAnalytics from './pages/ResultsAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const HomeWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Home />;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Unified Landing Page (Dashboard) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UnifiedDashboard />
              </ProtectedRoute>
            }
          />

          {/* Specialized Action Routes (Still needed for deep linking) */}
          <Route
            path="/admin/hackathons/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateHackathon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hackathons/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <HackathonDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/judge/hackathons/:id/evaluate"
            element={
              <ProtectedRoute requiredRole="judge">
                <JudgeEvaluationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/register-team/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <TeamRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit/:hackathonId/:teamId"
            element={
              <ProtectedRoute requiredRole="student">
                <SubmitProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <ResultsAnalytics />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
