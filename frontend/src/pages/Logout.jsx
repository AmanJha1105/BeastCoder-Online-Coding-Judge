import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Logout = () => {
  const { logout, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('lastVisitedPage', currentPath);
    await logout();
    setUser(null);  // Ensure the user context is cleared
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
