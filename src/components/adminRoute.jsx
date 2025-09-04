import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoute({ children }) {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/" />;
  if (!userData) return null; 
  if (userData.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
}
