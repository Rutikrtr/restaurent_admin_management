// components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasRequiredRole = allowedRoles.includes(user.accountType);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.accountType === 'superadmin' 
      ? '/dashboard' 
      : '/management';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;