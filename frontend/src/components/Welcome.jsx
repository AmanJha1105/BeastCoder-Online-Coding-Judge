import React, { useEffect, useState } from "react";
import axios from "axios";
import Question from './Question';

axios.defaults.withCredentials = true;

let firstRender = true;

const Welcome = () => {
  const [user, setUser] = useState();

  const refreshToken = async () => {
    const res = await axios.get("http://localhost:5000/api/refresh", {
      headers: {
        Cookie: document.cookie // Send cookies in the request headers
      }
    }).catch((err) => console.log(err));
  
    const data = res?.data;
    return data;
  };
  
  const sendRequest = async () => {
    const res = await axios.get("http://localhost:5000/api/user", {
      headers: {
        Cookie: document.cookie // Send cookies in the request headers
      }
    }).catch((err) => console.log(err));
  
    const data = res?.data;
    return data;
  };
  

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      sendRequest().then((data) => setUser(data.user));
    }
    const interval = setInterval(() => {
      refreshToken().then((data) => setUser(data.user));
    }, 1000 * 60 * 59); // Refresh token every 59 minutes
    return () => clearInterval(interval);
  }, []);

  return <Question />;
};

export default Welcome;
