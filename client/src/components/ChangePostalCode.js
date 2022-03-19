import { useState, useContext } from "react";
import AuthenticationContext from "../AuthenticationContext.js";
import { Button, TextField } from "@mui/material";

const ChangePostalCode = ({ setSnackbarOptions }) => {
  const [postalCode, setPostalCode] = useState("");
  const authContext = useContext(AuthenticationContext);
  const changePostalCode = async (e) => {
    let newPostalCode = postalCode;
    newPostalCode = newPostalCode.replace(" ", "");
    e.preventDefault();
    if (!newPostalCode.match(/[A-Z][0-9][A-Z][0-9][A-Z][0-9]/)) {
      setSnackbarOptions({
        isOpen: true,
        message: "please enter a valid postal code",
        type: "error",
      });
      return;
    }
    let locationData = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${newPostalCode}&key=AIzaSyARJm7VsKguXUUC7lE2ZhKc6Nr64L7zbxI`
    );
    locationData = await locationData.json();
    if (locationData.status === "ZERO_RESULTS") {
      setSnackbarOptions({
        isOpen: true,
        message: "Sorry, that postal code wasn't found.",
        type: "error",
      });
      return;
    }
    locationData = locationData.results[0].geometry.location;
    let response = await fetch("/api/updatePostalCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: authContext.userId,
        latitude: locationData.lat,
        longitude: locationData.lng,
      }),
    });
    response = await response.json();
    if (response.success) {
      setSnackbarOptions({
        isOpen: true,
        message: "Postal code updated.",
        type: "success",
      });
    } else {
      setSnackbarOptions({
        isOpen: true,
        message: "Something went wrong.",
        type: "error",
      });
    }

    authContext.setLatitude(locationData.lat);
    authContext.setLongitude(locationData.lng);
    setPostalCode("");
  };
  return (
    <div>
      <Button color="secondary">Change postal code</Button>
      <form onSubmit={changePostalCode}>
        <TextField
          label="new postal code"
          id="postalCode"
          type="text"
          color="tertiary"
          placeholder="A1A 1A1"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ width: "100%", marginBottom: 20 }}
        />
        <Button type="submit" variant="outlined" color="secondary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ChangePostalCode;
