import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export function PrivateRoute() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
