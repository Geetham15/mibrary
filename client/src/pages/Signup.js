import React from "react";
import SignUpForm from "../components/forms/SignUpForm";
function Signup({ setSnackbarOptions }) {
  return (
    <div>
      <SignUpForm setSnackbarOptions={setSnackbarOptions} />
    </div>
  );
}

export default Signup;
