import { useLocation, Navigate } from 'react-router-dom';

const PasswordResetRequested = () => {
  const location = useLocation();
  const fromForm = location.state?.fromForm;
  const requested = sessionStorage.getItem('passwordResetRequested');

  if (!fromForm && !requested) {
    // If someone typed the URL or refreshed, redirect to /forgot-password
    return <Navigate to="/forgot-password" />;
  }

  // Clear after rendering it once
  sessionStorage.removeItem('passwordResetRequested');

  return (
    <div>
      <h2>Check your email</h2>
      <p>We’ve sent you a link to reset your password.</p>
    </div>
  );
};

export default PasswordResetRequested;