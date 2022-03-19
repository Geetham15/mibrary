import AuthenticationContext from "../AuthenticationContext";
import { useContext } from "react";

const BookRow = ({ id, title, author, condition, comments, deleteBook }) => (
  <tr>
    <td>{title}</td>
    <td>{author}</td>
    <td>{condition}</td>
    <td>{comments}</td>
    <td>
      <button type="button" className="btn" onClick={() => deleteBook(id)}>
        delete
      </button>
    </td>
  </tr>
);

const UserBooks = ({ books, setBooks }) => {
  const authContext = useContext(AuthenticationContext);
  async function deleteBook(id) {
    setBooks(() => {
      let newBooks = books.filter((book) => {
        return book.id !== id;
      });
      return newBooks;
    });
    let response = await fetch("/api/deleteBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: authContext.userId }),
    });
    response = await response.json();
    if (response) {
      alert("Delete was successful");
    } else {
      alert("something went wrong");
    }
  }

  return (
    <div className="container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Condition</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <BookRow
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                condition={book.condition}
                comments={book.comments}
                deleteBook={deleteBook}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserBooks;
