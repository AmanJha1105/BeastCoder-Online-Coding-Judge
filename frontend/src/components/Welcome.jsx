import React, { useEffect, useState } from "react";
import axios from "axios";
import Question from './Question';

axios.defaults.withCredentials = true;

const Welcome = () => {
  const [user, setUser] = useState();

  const refreshToken = async () => {
    const res = await axios.get("http://localhost:5000/api/refresh")
      .catch((err) => console.log(err));
  
    const data = res?.data;
    return data;
  };
  
  const sendRequest = async () => {
    const res = await axios.get("http://localhost:5000/api/user")
      .catch((err) => console.log(err));
  
    const data = res?.data;
    return data;
  };
  

  useEffect(() => {
      sendRequest().then((data) => setUser(data.user));
    const interval = setInterval(() => {
      refreshToken().then((data) => setUser(data.user));
    }, 1000 * 60 * 59); // Refresh token every 59 minutes
    return () => clearInterval(interval);
  }, []);


  return (
    <>
    <Question /></>
  );
};

export default Welcome;
