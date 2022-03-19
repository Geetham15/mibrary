import "./App.css";
import { useState, useEffect, useContext, useRef } from "react";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import AuthenticationContext from "./AuthenticationContext";
import LandingPage from "./pages/LandingPage";
import ChatBox from "./components/ChatBox";
import { io } from "socket.io-client";
import NavBar from "./components/NavBar";
import CustomizedSnackBar from "./components/CustomizedSnackbar";

import { flexbox } from "@mui/system";
import { columns1 } from "./data/tableOptions";
import About from "./pages/About";
import TeamProfile from "./pages/TeamProfile";



function App() {
  const [bookData, setBookData] = useState([]);
  const [books, setBooks] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const socket = useRef();
  const authContext = useContext(AuthenticationContext);
  const [booksDueSoon, setBooksDueSoon] = useState(false);
  const [booksRented, setBooksRented] = useState([]);
  const [lentBooks, setLentBooks] = useState([]);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [tableDisplay, setTableDisplay] = useState(1);
  const [chattingWith, setChattingWith] = useState(null);
  const [newMessages, setNewMessages] = useState({ testing: 0 });
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [snackbarOptions, setSnackbarOptions] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);

  useEffect(() => {
    socket.current.on("updateAllBooks", ({ id, options, message, type }) => {
      setSnackbarOptions({
        isOpen: true,
        message,
        type,
      });
      loadAllBooks(id, options);
    });
    socket.current.on("initiateChat", ({ toUserId, username }) => {
      setUsers((old) => {
        const newObject = {
          id: toUserId,
          toUserId,
          username,
        };
        return [...old, newObject];
      });
    });
    socket.current.on("deleteConversation", ({ otherId }) => {
      setUsers((old) => {
        return old.filter((user) => {
          return user.toUserId !== otherId;
        });
      });
      setPendingRentals((old) => {
        return old.filter((rental) => {
          return (
            rental.bookborrower_id !== otherId &&
            rental.bookowner_id !== otherId
          );
        });
      });
    });
  }, []);

  async function loadUsers(id = authContext.userId) {
    let response = await fetch(`/api/loadUsers/${id}`);
    response = await response.json();
    setUsers(response);
  }

  async function getBooksRented(id = authContext.userId) {
    let dueBookList = await fetch(`/api/getBooksRented/${id}`);
    dueBookList = await dueBookList.json();
    dueBookList = await dueBookList.sort((a, b) => {
      return a.daysLeftToReturn - b.daysLeftToReturn;
    });
    console.log(dueBookList);
    setBooksRented(dueBookList);
  }
  async function getBooks(id = authContext.userId) {
    let fetchBook = await fetch(`/api/userBooks/${id}`);
    let bookList = await fetchBook.json();
    setBooks(bookList);
  }
  async function getLentBooks(id = authContext.userId) {
    let result = await fetch(`/api/getLentBooks/${id}`);
    result = await result.json();
    console.log(result);
    setLentBooks(result);
  }
  async function loadPendingRentals(id = authContext.userId) {
    let response = await fetch(`/api/getPendingRentals/${id}`);
    response = await response.json();
    console.log("pending rentals", response);
    setPendingRentals(response);
  }
  async function loadAllBooks(
    id = authContext.userId,
    options = {
      booksRented: true,
      booksOwned: true,
      lentBooks: true,
      pending: true,
    }
  ) {
    if (options.booksRented) {
      await getBooksRented(id);
    }
    if (options.booksOwned) {
      await getBooks(id);
    }
    if (options.lentBooks) {
      await getLentBooks(id);
    }
    if (options.pending) {
      await loadPendingRentals(id);
      console.log(pendingRentals);
      for (let book of booksRented) {
        if (book.daysLeftToReturn <= 4) {
          setBooksDueSoon(true);
        }
      }
    }
  }

  const loadAllInitialData = async () => {
    await loadAllBooks();
    await loadUsers();
  };

  useEffect(() => {
    if (authContext.userId) {
      loadAllInitialData();
      socket.current.emit("addUser", authContext.userId);
      socket.current.on("getUsers", (users) => {
        //console.log(users);
      });
    }
  }, [authContext.userId]);

  return (
    <div
      style={{
        backgroundColor: "#e2f8ff", //#ededed
        display: "flex",
        flexFlow: "column",
        height: "100%",
        width: "100%",
        margin: 0,
        position: "absolute",
      }}
    >
      <NavBar
        booksDueSoon={booksDueSoon}
        isPendingConfirmation={isPendingConfirmation}
        setTableDisplay={setTableDisplay}
        setBookData={setBookData}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              bookData={bookData}
              setBookData={setBookData}
              setIsChatOpen={setIsChatOpen}
              setChattingWith={setChattingWith}
              setPendingRentals={setPendingRentals}
              socket={socket}
              loadAllBooks={loadAllBooks}
              setSnackbarOptions={setSnackbarOptions}
              setUsers={setUsers}
            />
          }
        />
        <Route
          exact
          path="/login"
          element={<Login setSnackbarOptions={setSnackbarOptions} />}
        />
        <Route
          exact
          path="/signup"
          element={<SignUp setSnackbarOptions={setSnackbarOptions} />}
        />
        <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          exact
          path="/userDashboard"
          element={
            <UserDashboard
              books={books}
              setBooks={setBooks}
              booksRented={booksRented}
              tableDisplay={tableDisplay}
              setTableDisplay={setTableDisplay}
              lentBooks={lentBooks}
              pendingRentals={pendingRentals}
              setSnackbarOptions={setSnackbarOptions}
            />
          }
        />

        <Route exact path="/about" element={<About />} />

        <Route exact path="/team" element={<TeamProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isChatOpen && (
        <ChatBox
          setIsChatOpen={setIsChatOpen}
          socket={socket}
          lentBooks={lentBooks}
          setLentBooks={setLentBooks}
          booksRented={booksRented}
          pendingRentals={pendingRentals}
          setPendingRentals={setPendingRentals}
          setChattingWith={setChattingWith}
          chattingWith={chattingWith}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          loadAllBooks={loadAllBooks}
          setIsPendingConfirmation={setIsPendingConfirmation}
          setSnackbarOptions={setSnackbarOptions}
          users={users}
          setUsers={setUsers}
        />
      )}
      {snackbarOptions.isOpen && (
        <CustomizedSnackBar
          snackbarOptions={snackbarOptions}
          setSnackbarOptions={setSnackbarOptions}
        />
      )}
      <Footer
        setIsChatOpen={setIsChatOpen}
        setNewMessages={setNewMessages}
        socket={socket}
      />
    </div>
  );
}

export default App;
