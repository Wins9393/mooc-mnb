import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const AuthGuard = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { user } = authContext;

  if (!user?.authenticated) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AuthGuard;
