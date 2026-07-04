// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ROUTES } from '../constants/routes';

function ProtectedRoute() {
  const Token = useAuthStore((state) => state.user);

  if (!Token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;