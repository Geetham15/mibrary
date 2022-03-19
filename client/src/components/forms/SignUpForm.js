import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

function SignUp({ setSnackbarOptions }) {
  const initialValues = {
    username: "",
    email: "",
    postalCode: "",
    password: "",
    confirmPass: "",
  };

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    let postalCode = values.postalCode.replace(" ", "");
    if (!postalCode.match(/[A-Z][0-9][A-Z][0-9][A-Z][0-9]/)) {
      setSnackbarOptions({
        isOpen: true,
        message: "please enter a valid postal code",
        type: "error",
      });
      return;
    }
    let locationData = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${values.postalCode}&key=AIzaSyARJm7VsKguXUUC7lE2ZhKc6Nr64L7zbxI`
    );
    locationData = await locationData.json();
    locationData = locationData.results[0].geometry.location;
    let response = await fetch("/api/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        latitude: locationData.lat,
        longitude: locationData.lng,
      }),
    });
    response = await response.json();
    // alert(response.message);
    if (response.success) {
      setSnackbarOptions({
        isOpen: true,
        message: "Welcome to MiBrary! Please log in to continue.",
        type: "success",
      });
      navigate("/login");
    } else {
      setSnackbarOptions({
        isOpen: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      navigate("/signup");
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Please enter your name"),
    email: Yup.string()
      .email("invalid email format")
      .required("Please enter a valid email address"),
    postalCode: Yup.string().required("please enter a valid postal code"),
    password: Yup.string().required(
      "Please enter a password between 5 and 15 characters"
    ),
    confirmPass: Yup.string().required("password does not match"),
  });

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form
          className="flex flex-col justify-center items-center "
          style={{ marginTop: 20 }}
        >
          <div className="text-center text-2xl">
            <h1>Sign Up</h1>
          </div>
          <div className="">
            <label htmlFor="username">Username</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Bob_Smith"
            />
            <ErrorMessage name="username" component={TextError} />
          </div>
          <div className="">
            <label htmlFor="email">Email</label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="your_email@gmail.com"
            />
            <ErrorMessage name="email" component={TextError} />
          </div>
          <div className="">
            <label htmlFor="postalCode">Postal Code</label>
            <Field
              type="postalCode"
              id="postalCode"
              name="postalCode"
              placeholder="A1A 1A1"
            />
            <ErrorMessage name="postalCode" component={TextError} />
          </div>
          <div className="">
            <label htmlFor="password">Password</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component={TextError} />
          </div>
          <div className="">
            <label htmlFor="confirmPass"> Confirm Password</label>
            <Field type="password" id="confirmPass" name="confirmPass" />
            <ErrorMessage name="confirmPass" component={TextError} />
          </div>
          <div className="text-sm">
            <p>Your personal data will be used to support your experience</p>{" "}
            <p>
              throughout this website, to manage access to your account, and
            </p>{" "}
            <p>for other purposes described in our</p>
            <NavLink exact to="/privacypolicy">
              <Field as="button">
                <strong className="text-red-600">privacy policy.</strong>
              </Field>
            </NavLink>
          </div>

          <div>
            <Field as="button" type="submit" value="Sign Up" />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              style={{ width: 200, marginBottom: 10, marginTop: 10 }}
            >
              Sign up
            </Button>
          </div>
          <div>
            <p className="float-left">Already have an account?</p>
          </div>
          <NavLink exact to="/login">
            <Button
              variant="outlined"
              color="secondary"
              style={{ marginTop: 10 }}
            >
              Log in
            </Button>
          </NavLink>
        </Form>
      </Formik>
    </Box>
  );
}

export default SignUp;
