import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // return user ? children : <Navigate to="/auth/admin" replace />;
  return children;
};

export default ProtectedRoute;
