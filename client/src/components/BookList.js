import React, { useEffect, useState } from "react";

const BookRow = ({ title, author, user_id, condition, comments }) => (
  <tr>
    <td>{title}</td>
    <td>{author}</td>
    <td>{user_id}</td>
    <td>{condition}</td>
    <td>{comments}</td>
  </tr>
);
const BookList = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function getBooks() {
      let fetchBook = await fetch("/api/bookList");
      let bookList = await fetchBook.json();
      console.log(bookList);
      setBooks(bookList);
    }
    getBooks();
  }, []);

  return (
    <div>
      <h2>Book List</h2>
      <table>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>User id</th>
            <th>Condition</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => {
            return (
              <BookRow
                key={book[0].value}
                title={book[1].value}
                author={book[2].value}
                condition={book[6].value}
                comments={book[7].value}
                user_id={book[8].value}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
