import ChatUsers from "./ChatUsers.js";
import { useState, useEffect, useContext, useRef } from "react";
import Chat from "./Chat.js";
import AuthenticationContext from "../AuthenticationContext.js";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from "@mui/material/List";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import RatingDialog from "./RatingDialog.js";

const ChatBox = ({
  setIsChatOpen,
  socket,
  lentBooks,
  setLentBooks,
  booksRented,
  pendingRentals,
  setPendingRentals,
  setChattingWith,
  chattingWith,
  setNewMessages,
  newMessages,
  loadAllBooks,
  setIsPendingConfirmation,
  setSnackbarOptions,
  users,
  setUsers,
}) => {
  const authContext = useContext(AuthenticationContext);
  const [isRateUserOpen, setIsRateUserOpen] = useState(false);

  const deleteConversation = async (id) => {
    for (const book of lentBooks) {
      if (book.bookborrower_id === id) {
        setSnackbarOptions({
          isOpen: true,
          message:
            "Because you're currently lending to this user, you can't delete this conversation.",
          type: "error",
        });
        return;
      }
    }
    for (const book of booksRented) {
      if (book.bookowner_id === id) {
        setSnackbarOptions({
          isOpen: true,
          message:
            "Because you're currently renting from this user, you can't delete this conversation.",
          type: "error",
        });

        return;
      }
    }
    setSnackbarOptions({
      isOpen: true,
      message: "Conversation deleted.",
      type: "success",
    });
    setUsers((old) => {
      return old.filter((user) => {
        return user.toUserId !== id;
      });
    });
    setPendingRentals((old) => {
      return old.filter((rental) => {
        console.log(rental);
        return rental.bookborrower_id !== id && rental.bookowner_id !== id;
      });
    });
    let response = await fetch("/api/deletePending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        userId: authContext.userId,
      }),
    });
    response = await response.json();
    console.log(response);
    let response2 = await fetch("/api/deleteConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        userId: authContext.userId,
      }),
    });
    response2 = await response2.json();
    socket.current.emit("deleteConversation", {
      id,
      otherId: authContext.userId,
    });
    console.log(response2);
  };

  return (
    <div className="chatBox">
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBar position="static" color="secondary">
          <Toolbar>
            {chattingWith && (
              <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setChattingWith(null)}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {chattingWith ? chattingWith.username : "Chat"}
            </Typography>
            {chattingWith && (
              <IconButton onClick={() => setIsRateUserOpen(true)}>
                <StarIcon />
              </IconButton>
            )}
            <IconButton
              color="inherit"
              onClick={() => {
                setIsChatOpen((old) => !old);
                setChattingWith(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <List style={{ backgroundColor: "white" }}>
          {chattingWith ? (
            <Chat
              chattingWith={chattingWith}
              socket={socket}
              pendingRentals={pendingRentals}
              setPendingRentals={setPendingRentals}
              setNewMessages={setNewMessages}
              lentBooks={lentBooks}
              setLentBooks={setLentBooks}
              booksRented={booksRented}
              loadAllBooks={loadAllBooks}
              setIsPendingConfirmation={setIsPendingConfirmation}
              setSnackbarOptions={setSnackbarOptions}
            />
          ) : (
            <div
              style={{
                overflowY: "scroll",
                height: 350,
              }}
            >
              <ChatUsers
                users={users}
                setChattingWith={setChattingWith}
                deleteConversation={deleteConversation}
                newMessages={newMessages}
                setNewMessages={setNewMessages}
              />
            </div>
          )}
        </List>
        {chattingWith && isRateUserOpen && (
          <RatingDialog
            chattingWith={chattingWith}
            isRateUserOpen={isRateUserOpen}
            setIsRateUserOpen={setIsRateUserOpen}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatBox;
