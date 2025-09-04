import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Spin } from "antd";

export default function PublicRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "60vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (currentUser) {
    if (userData?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
