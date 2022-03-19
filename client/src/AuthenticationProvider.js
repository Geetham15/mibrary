import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationContext from "./AuthenticationContext";

const AuthenticationProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigate = useNavigate();
  const logOut = async () => {
    setUsername("");
    setUserId("");
    setLatitude(0);
    setLongitude(0);
    let response = await fetch("/api/logOut");
    response = await response.json();
    console.log(response.message);
    navigate("/");
  };

  async function setLoggedIn() {
    let response = await fetch("/api/loggedIn");
    response = await response.json();
    setUsername(response.username);
    setUserId(response.userId);
    setLatitude(response.latitude);
    setLongitude(response.longitude);
    return response.username;
  }
  useEffect(() => {
    setLoggedIn();
  }, []);

  const authContext = {
    userId,
    username,
    latitude,
    setLatitude,
    setLongitude,
    longitude,
    logOut,
    setLoggedIn,
  };
  return (
    <AuthenticationContext.Provider value={authContext}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
