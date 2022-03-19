import { React, useContext } from "react";
import Map from "../components/Map";
import Search from "../components/Search.js";
import AuthenticationContext from "../AuthenticationContext";
import Login from "./Login.js";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function Home({
  bookData,
  setBookData,
  setIsChatOpen,
  setChattingWith,
  setPendingRentals,
  socket,
  loadAllBooks,
  setSnackbarOptions,
  setUsers,
}) {
  const authContext = useContext(AuthenticationContext);
  return (
  
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
    
      {authContext.username ? (
        <Card
          sx={{
            minWidth: 275,
            maxWidth: 1000,
            minHeight: 300,
            maxHeight: 1000,
          }}
          style={{ marginTop: 20 }}
        >
          <CardContent>
            <Search
              bookData={bookData}
              setBookData={setBookData}
              setSnackbarOptions={setSnackbarOptions}
            />
            <Map
              bookData={bookData}
              setIsChatOpen={setIsChatOpen}
              setChattingWith={setChattingWith}
              setPendingRentals={setPendingRentals}
              socket={socket}
              loadAllBooks={loadAllBooks}
              setUsers={setUsers}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Login setSnackbarOptions={setSnackbarOptions} />
        </>
      )}
    </div>
  );
}

export default Home;
