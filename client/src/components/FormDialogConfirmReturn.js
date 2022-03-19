import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AuthenticationContext from "../AuthenticationContext";

export default function FormDialogConfirmReturn({
  lentBooksPerUser,
  socket,
  loadAllBooks,
  setSnackbarOptions,
}) {
  const [open, setOpen] = useState(false);
  const authContext = useContext(AuthenticationContext);

  const confirmReturn = async () => {
    let data = {
      bookBorrowingId: lentBooksPerUser[0]?.book_borrowing_id,
    };
    console.log(data);
    let response = await fetch("/api/confirmReturn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    response = await response.json();

    await loadAllBooks(authContext.userId, {
      booksRented: false,
      booksOwned: false,
      lentBooks: true,
      pending: false,
    });

    socket.current.emit("updateAllBooks", {
      id: lentBooksPerUser[0]?.bookborrower_id,
      options: {
        booksRented: true,
        booksOwned: false,
        lentBooks: false,
        pending: false,
      },
      message: `${authContext.username} has confirmed that you returned ${lentBooksPerUser[0]?.title}.`,
      type: "success",
    });
    if (response.success) {
      setSnackbarOptions({
        isOpen: true,
        message: "Return confirmed.",
        type: "success",
      });
    } else {
      setSnackbarOptions({
        isOpen: true,
        message: "Something went wrong.",
        type: "error",
      });
    }
  };

  // const cancelReturn = async () => {
  //   let data = {
  //     bookBorrowingId: lentBooksPerUser[0]?.book_borrowing_id,
  //     bookStatus: "Lend",
  //   };
  //   let response = await fetch("/api/cancelReturn", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  //   response = await response.json();
  //   alert(response.message);
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {lentBooksPerUser !== [] && lentBooksPerUser[0]?.bookStatus === "return" && (
        <Button
          variant="outlined"
          color="tertiary"
          style={{ width: "100%" }}
          onClick={handleClickOpen}
        >
          Confirm Return
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Return</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do this if you are currently meeting with the book's borrower and
            are making the transaction.
          </DialogContentText>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={lentBooksPerUser[0]?.title}
            readOnly
          />
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            type="text"
            value={lentBooksPerUser[0]?.authors}
            readOnly
          />
          <label htmlFor="condition">Condition</label>
          <input
            id="condition"
            name="condition"
            type="text"
            value={lentBooksPerUser[0]?.condition}
            readOnly
          />
          <label htmlFor="dateBorrowed">Pickup date</label>

          <p>{lentBooksPerUser[0]?.dateBorrowed}</p>

          <label htmlFor="dueDateForReturn">Due Date</label>

          <p>{lentBooksPerUser[0]?.dateDueForReturn}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="tertiary">
            Cancel
          </Button>

          <Button
            onClick={() => {
              confirmReturn();
              handleClose();
            }}
            color="tertiary"
          >
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
