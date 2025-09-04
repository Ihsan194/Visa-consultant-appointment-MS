import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Spin } from "antd";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/" replace />;

  if (adminOnly && userData?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
