import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import TextError from "./TextError";
import * as Yup from "yup";
import "./LoginForm.css";
import AuthenticationContext from "../../AuthenticationContext";
import { Button } from "@mui/material";

function LoginForm({ setSnackbarOptions }) {
  const initialValues = {
    email: "",
    password: "",
  };
  const [loginError, setLoginError] = useState("");
  const authContext = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    let response = await fetch("/api/logIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    response = await response.json();
    if (response.message === "success") {
      const username = await authContext.setLoggedIn();
      setLoginError("");
      navigate("/");
      setSnackbarOptions({
        isOpen: true,
        message: `Welcome back, ${username}`,
        type: "success",
      });
    } else {
      setLoginError("Login Failed!");
      setSnackbarOptions({
        isOpen: true,
        message: "Login failed.",
        type: "error",
      });
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("invalid email format")
      .required("Please enter a valid email address"),
    password: Yup.string().required(
      "Please enter a password between 5 and 15 characters"
    ),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form
        className="flex flex-col justify-center items-center "
        style={{ marginTop: 40 }}
      >
        <div className="text-center text-2xl">
          <h1>Login</h1>
        </div>
        <div className="">
          <label htmlFor="email">Email</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component={TextError} />
        </div>
        <div className="">
          <label htmlFor="password">Password</label>
          <Field
            type="password"
            id="password"
            name="password"
            minLength="3"
            maxLength="15"
          />
          <ErrorMessage name="password" component={TextError} />
          <NavLink exact to="/forgotpassword">
            <Field as="button" className="float-right">
              <h3>Forgot Password?</h3>
            </Field>
          </NavLink>
        </div>
        <div>
          <Field as="button" type="submit" value="Login" />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            style={{ marginBottom: 20, width: 200, marginTop: 20 }}
          >
            Log in
          </Button>
          <p>Don't have an account?</p>
          <NavLink exact to="/signup">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              style={{ marginTop: 20, width: 200 }}
            >
              Sign up
            </Button>
          </NavLink>
        </div>
      </Form>
    </Formik>
  );
}

export default LoginForm;
