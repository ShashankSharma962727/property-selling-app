
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedin, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
