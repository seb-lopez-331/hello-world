// routes/ProtectedRoute.jsx
import { Outlet } from 'react-router-dom';
import NotAuthorized from '../pages/NotAuthorized';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Outlet /> : <NotAuthorized />;
}
