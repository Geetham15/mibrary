import { useContext, useState } from "react";
import AuthenticationContext from "../AuthenticationContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Search = ({ setBookData, setSnackbarOptions }) => {
  const authContext = useContext(AuthenticationContext);
  const [entry, setEntry] = useState("");
  const currentLocation = [authContext.latitude, authContext.longitude];
  // const calculateHaversine = (coordinates) => {
  //   let lat2 = (coordinates[0] * Math.PI) / 180;
  //   let lat1 = (currentLocation[0] * Math.PI) / 180;
  //   let long2 = (coordinates[1] * Math.PI) / 180;
  //   let long1 = (currentLocation[1] * Math.PI) / 180;
  //   let result =
  //     2 *
  //     6371.009 *
  //     Math.asin(
  //       Math.sqrt(
  //         Math.sin((lat2 - lat1) / 2) * Math.sin((lat2 - lat1) / 2) +
  //           Math.cos(lat1) *
  //             Math.cos(lat2) *
  //             Math.sin((long2 - long1) / 2) *
  //             Math.sin((long2 - long1) / 2)
  //       )
  //     );
  //   return result;
  // };
  const onSearch = async (e) => {
    e.preventDefault();
    let response = await fetch(`/api/search/${entry}`);
    response = await response.json();
    console.log(response);
    if (response.length > 0) {
      setBookData(response);
    } else {
      setBookData(null);
      setSnackbarOptions({
        isOpen: true,
        message: "Nothing found",
        type: "warning",
      });
    }
  };
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSearch}
    >
      <TextField
        id="standard-basic"
        label="What would you like to read?"
        variant="standard"
        color="secondary"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        style={{ width: "100%" }}
        size="large"
        inputProps={{ style: { fontSize: 24 } }}
      />
      <Button
        color="secondary"
        type="submit"
        variant="contained"
        style={{ width: "100%" }}
      >
        Search
      </Button>
    </Box>
  );
};

export default Search;
