import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const AuthGuard = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  const { user, loading } = authContext ?? {};

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user?.authenticated) {
    return <Navigate to="/" />;
  }

  if (user.role === "user" && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthGuard;
