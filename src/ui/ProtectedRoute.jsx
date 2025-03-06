import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LoadingComponent } from "./sections";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingComponent />;

  return user ? children : <Navigate to="/auth/admin" replace />;
};

export default ProtectedRoute;
