import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/user`,{ withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BackendUrl}/api/login` ,{ email, password }, { withCredentials: true });
      setUser(response.data.user);
      localStorage.setItem('userId',response.data.user_id);
      localStorage.setItem('username',response.data.user.username);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BackendUrl}/api/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
};