// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import AddAppointment from "./pages/AddAppointment";

import PrivateRoute from "./components/privateRoute";
import PublicRoute from "./components/publicRoute";
import ProtectedRoute from "./components/protectedRoute";
import { useAuth } from "./context/authContext";

export default function App() {
  const { userData } = useAuth();

  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Public-only routes (blocked if logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* User routes (role === "user") */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {userData?.role === "user" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/admin" replace />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            {userData?.role === "user" ? (
              <Profile />
            ) : (
              <Navigate to="/admin" replace />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <PrivateRoute>
            {userData?.role === "user" ? (
              <AddAppointment />
            ) : (
              <Navigate to="/admin" replace />
            )}
          </PrivateRoute>
        }
      />

      {/* Admin-only route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all → redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
