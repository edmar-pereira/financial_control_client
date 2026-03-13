import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}