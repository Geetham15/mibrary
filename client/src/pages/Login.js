import React from "react";
import LoginForm from "../components/forms/LoginForm";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
function Login({ setSnackbarOptions }) {
  return (
    <div>
      <LoginForm setSnackbarOptions={setSnackbarOptions} />
    </div>
  );
}

export default Login;
