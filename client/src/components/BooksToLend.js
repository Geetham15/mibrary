import React, { useContext, useState } from "react";
import AuthenticationContext from "../AuthenticationContext";

const BooksToLend = ({ selectedBook, initializeChat }) => {
  const authContext = useContext(AuthenticationContext);
  const [currentDateBorrowed, setDateBorrowed] = useState();
  const [dateDueForReturn, setDateDueForReturn] = useState();
  const [bookStatus, setBookStatus] = useState();

  console.log("bookborrower_id", authContext.userId);

  const bookOutOnLoan = async (e) => {
    e.preventDefault();
    let data = {
      title: selectedBook.title,
      author: selectedBook.authors,
      bookowner_id: selectedBook.user_id,
      bookborrower_id: authContext.userId,
      bookId: selectedBook.id,
      dateBorrowed: currentDateBorrowed,
      dateDueForReturn: dateDueForReturn,
      bookStatus: bookStatus,
    };
    console.log(data);
    let response = await fetch("/api/bookOutOnLoan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    response = await response.json();
    initializeChat();
    alert(response.message);
  };
  return (
    <div>
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="title">Title</label>
              </td>
              <td>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={selectedBook.title}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="author">Author</label>
              </td>
              <td>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={selectedBook.authors}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Book owner">Book Owner</label>
              </td>
              <td>
                <input
                  id="bookOwner"
                  name="bookOwner"
                  type="text"
                  value={selectedBook.userName}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="bookBorrower">Book Borrower</label>
              </td>
              <td>
                <input
                  id="bookBorrower"
                  name="bookBorrower"
                  type="text"
                  value={authContext.username}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="dateBorrowed">Date Borrowed</label>
              </td>
              <td>
                <input
                  type="date"
                  name="dateBorrowed"
                  value={currentDateBorrowed}
                  onChange={(e) => setDateBorrowed(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="dueDateForReturn">Due Date</label>
              </td>
              <td>
                <input
                  type="date"
                  name="dueDateForReturn"
                  value={dateDueForReturn}
                  onChange={(e) => setDateDueForReturn(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="bookStatus">BookStatus</label>
              </td>
              <td>
                <select
                  name="bookStatus"
                  value={bookStatus}
                  onChange={(e) => setBookStatus(e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Lend">Lend</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Trade">Trade</option>
                </select>
              </td>
              {/* <td><input type='text' name='bookStatus' id='bookStatus' 
                        value ={bookStatus} onChange={e=>setBookStatus(e.target.value)}/></td> */}
            </tr>
          </tbody>
          <button className="btn" onClick={bookOutOnLoan}>
            Checkout
          </button>
        </table>
      </form>
    </div>
  );
};

export default BooksToLend;
