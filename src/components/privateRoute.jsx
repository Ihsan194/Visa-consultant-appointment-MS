import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Spin } from "antd";

export default function PrivateRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/" replace />;

  // ✅ If user is logged in but userData not ready yet, show spinner instead of blocking
  if (!userData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Spin size="large" tip="Loading user data..." />
      </div>
    );
  }

  return children;
}
