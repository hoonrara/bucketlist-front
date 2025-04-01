import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-lg">⏳ 사용자 확인 중...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
