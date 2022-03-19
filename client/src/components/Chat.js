import { useState, useContext, useEffect, useRef } from "react";
import AuthenticationContext from "../AuthenticationContext.js";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import FormDialog from "./FormDialog.js";
import FormDialogReturn from "./FormDialogReturn.js";
import FormDialogConfirmReturn from "./FormDialogConfirmReturn.js";

const Chat = ({
  chattingWith,
  socket,
  pendingRentals,
  setPendingRentals,
  setNewMessages,
  lentBooks,
  setLentBooks,
  booksRented,
  loadAllBooks,
  setIsPendingConfirmation,
  setSnackbarOptions,
}) => {
  const [toSend, setToSend] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [pendingRentalsPerUser, setPendingRentalsPerUser] = useState();
  const [lentBooksPerUser, setLentBooksPerUser] = useState([]);
  const [booksRentedPerUser, setBooksRentedPerUser] = useState([]);
  const messagesEndRef = useRef(null);
  const authContext = useContext(AuthenticationContext);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [previousMessages]);

  useEffect(() => {
    setPendingRentalsPerUser(() => {
      return pendingRentals.filter((rental) => {
        return (
          rental.bookborrower_id === authContext.userId ||
          rental.bookowner_id === authContext.userId
        );
      });
    });
    setLentBooksPerUser(() => {
      return lentBooks.filter((lentBook) => {
        return lentBook.bookborrower_id === chattingWith.id;
      });
    });
    setBooksRentedPerUser(() => {
      return booksRented.filter((rentedBook) => {
        return rentedBook.bookowner_id === chattingWith.id;
      });
    });
  }, [pendingRentals, lentBooks, booksRented]);

  const sendMessage = async () => {
    setPreviousMessages(() => {
      if (previousMessages) {
        return [
          ...previousMessages,
          {
            fromUserId: authContext.userId,
            toUserId: chattingWith.id,
            message: toSend,
          },
        ];
      } else {
        return [
          {
            fromUserId: authContext.userId,
            toUserId: chattingWith.id,
            message: toSend,
          },
        ];
      }
    });
    let response = await fetch("/api/sendChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromUserId: authContext.userId,
        toUserId: chattingWith.id,
        message: toSend,
      }),
    });
    response = await response.json();
    console.log(response);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    socket.current.emit("sendMessage", {
      senderId: authContext.userId,
      receiverId: chattingWith.id,
      text: toSend,
    });
    sendMessage();
    setToSend("");
  };

  useEffect(() => {
    async function loadMessages() {
      let response = await fetch(
        `/api/loadChats?fromUserId=${authContext.userId}&toUserId=${chattingWith.id}`
      );
      response = await response.json();
      setPreviousMessages(response);
    }
    loadMessages();
  }, []);

  useEffect(() => {
    arrivalMessage && setPreviousMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        fromUserId: data.senderId,
        toUserId: data.receiverId,
        message: data.text,
      });
      setNewMessages((old) => {
        if (old[data.senderId]) {
          old[data.senderId] += 1;
        } else {
          old[data.senderId] = 1;
        }
        return old;
      });
    });
  }, []);

  return (
    <>
      <Box
        sx={{
          width: 300,
          height: 250,
          display: "flex",
          overflowY: "scroll",
          flexDirection: "column",
        }}
      >
        {previousMessages &&
          previousMessages.map((message) => {
            return (
              <div
                className={
                  message.fromUserId === authContext.userId
                    ? "chatSent"
                    : "chatReceived"
                }
                key={message.id}
              >
                <div
                  className={
                    message.fromUserId === authContext.userId
                      ? "singleMessageSent"
                      : "singleMessageReceived"
                  }
                >
                  <p style={{ color: "white" }}>{message.message}</p>
                </div>
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </Box>
      <Box>
        {pendingRentalsPerUser && (
          <FormDialog
            pendingRentalsPerUser={pendingRentalsPerUser}
            setPendingRentalsPerUser={setPendingRentalsPerUser}
            socket={socket}
            setPendingRentals={setPendingRentals}
            loadAllBooks={loadAllBooks}
            setIsPendingConfirmation={setIsPendingConfirmation}
            setSnackbarOptions={setSnackbarOptions}
          />
        )}
        {booksRentedPerUser.length !== 0 && (
          <FormDialogReturn
            booksRentedPerUser={booksRentedPerUser}
            setBooksRentedPerUser={setBooksRentedPerUser}
            socket={socket}
            loadAllBooks={loadAllBooks}
            setSnackbarOptions={setSnackbarOptions}
          />
        )}
        {lentBooksPerUser.length !== 0 && (
          <FormDialogConfirmReturn
            lentBooksPerUser={lentBooksPerUser}
            setLentBooksPerUser={setLentBooksPerUser}
            socket={socket}
            setLentBooks={setLentBooks}
            loadAllBooks={loadAllBooks}
            setSnackbarOptions={setSnackbarOptions}
          />
        )}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={toSend}
            onChange={(e) => setToSend(e.target.value)}
            style={{ width: "100%" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            style={{ width: "100%", marginTop: "auto" }}
          >
            send
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Chat;
