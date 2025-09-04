import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Spin } from "antd";

export default function PrivateRoute({ children }) {
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

  if (!currentUser) return <Navigate to="/" replace />;

  if (!userData) return null; 

  if (userData.role === "admin" && window.location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }
  if (userData.role === "user" && window.location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
