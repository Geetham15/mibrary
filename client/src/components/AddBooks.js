import { useContext, useState } from "react";
import AuthenticationContext from "../AuthenticationContext";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import CustomizedSnackBar from "./CustomizedSnackbar";

const AddBooks = ({ bookData, setBookData, setBooks, setSnackbarOptions }) => {
  const authContext = useContext(AuthenticationContext);

  const searchIsbn = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(
        `https://openlibrary.org/isbn/${bookData.isbn}.json`
      );
      response = await response.json();
      console.log(response);

      if (response.authors) {
        let author = await fetch(
          `https://openlibrary.org${response.authors[0].key}.json`
        );
        author = await author.json();
        console.log(author);
        response.authors = author.name;
        if (!author.name) {
          response.authors = author.personal_name;
        }
        console.log(author);
      } else {
        response.authors = "";
      }

      console.log(response);
      const { authors, title, physical_format, isbn_13, isbn_10 } = response;
      setBookData({
        ...bookData,
        authors,
        title,
        physical_format,
        isbn_13: isbn_13 ? isbn_13[0] : null,
        isbn_10: isbn_10 ? isbn_10[0] : null,
      });
    } catch {
      setSnackbarOptions({
        isOpen: true,
        message: "nothing found",
        type: "warning",
      });
      setBookData({ ...bookData, isbn: "" });
    }
  };
  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "subjects") {
      value = value.split(", ");
    }
    setBookData({ ...bookData, [name]: value });
  };
  const handleRadioChange = (e) => {
    setBookData({ ...bookData, condition: e.target.value });
  };
  const clearContents = () => {
    setBookData({
      comments: "",
      isbn: "",
      condition: "gently used",
    });
  };
  const addToLibrary = async (e) => {
    e.preventDefault();
    // this will connect to user's database
    console.log("added to database", bookData);
    let response = await fetch("/api/addBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bookData,
        authors: bookData.authors,
        user_id: authContext.userId,
      }),
    });
    response = await response.json();
    // Load user's books to update table with new info
    let fetchBook = await fetch(`/api/userBooks/${authContext.userId}`);
    let bookList = await fetchBook.json();
    setBooks(bookList);
    clearContents();
    setSnackbarOptions({
      isOpen: true,
      message: `${response.title} added to library.`,
      type: "success",
    });
  };
  return (
    <div>
      <form onSubmit={searchIsbn}>
        <TextField
          type="text"
          value={bookData.isbn}
          name="isbn"
          color="tertiary"
          onChange={handleChange}
          placeholder="enter ISBN here"
          style={{ marginBottom: 20, width: "100%" }}
        />
        <Button type="submit" variant="outlined" color="secondary">
          Search
        </Button>
        <Button
          type="reset"
          variant="text"
          color="secondary"
          onClick={clearContents}
        >
          Clear
        </Button>
      </form>
      {bookData.title && (
        <form onSubmit={addToLibrary}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="authors"
            value={bookData.authors}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
          <label htmlFor="binding">Binding</label>
          <input
            type="text"
            id="binding"
            name="physical_format"
            value={bookData.physical_format}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          <label htmlFor="comments">Comments</label>
          <input
            type="text"
            id="comments"
            name="comments"
            value={bookData.comments}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          <label>Condition</label>
          <div className="form-control-check">
            <label htmlFor="new">new</label>
            <input
              type="radio"
              id="new"
              name="condition"
              value="new"
              checked={bookData.condition === "new" ? true : false}
              onChange={handleRadioChange}
            />
            <label htmlFor="gently_used">gently used</label>
            <input
              type="radio"
              id="gently_used"
              name="condition"
              value="gently used"
              checked={bookData.condition === "gently used" ? true : false}
              onChange={handleRadioChange}
            />
            <label htmlFor="old">old</label>
            <input
              type="radio"
              id="old"
              name="condition"
              value="old"
              checked={bookData.condition === "old" ? true : false}
              onChange={handleRadioChange}
            />
          </div>
          <Button color="secondary" type="submit" variant="contained">
            Add to owned books
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddBooks;
