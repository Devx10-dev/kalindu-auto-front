import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

/**
 * used to check the page authorization. If user has the access then it is allowed to navigate to required page, but if not it will be redirected to 403 page.
 * @param allowedRoles string[]
 * @returns JSX.Element
 */
const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { roles } = useAuth();

  return roles?.find((role) => allowedRoles?.includes(role)) ? (
    // if one of user roles includes in allowed roles, it provide the children routes via Outlet
    <Outlet />
  ) : (
    <Navigate to="/error/error403" />
  );
};

export default RequireAuth;
