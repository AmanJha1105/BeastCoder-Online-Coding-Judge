import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetchUser();
  },[]);

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/user`,{ withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BackendUrl}/api/login` ,{ email, password }, { withCredentials: true });
      setUser(response.data.user);
      localStorage.setItem('userId',response.data.user?._id);
      localStorage.setItem('username',response.data.user?.username);
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

  const signup =async(fullname,name,email,password)=>{
    try {
      const response = await axios.post(`${BackendUrl}/api/signup`, {fullname,name,email,password}, { withCredentials: true });
      setUser(response.data.user);
      localStorage.setItem('userId',response.data.user?._id);
      localStorage.setItem('username',response.data.user?.username);
      fetchUser();
      toast.success("SingUp successfull. Please login now.")
    } catch (error) {
      console.error('Error in signup', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout ,setUser,signup}}>
      {children}
    </AuthContext.Provider>
  );
};