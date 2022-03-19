import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function bookOutOnLoan(req, res) {
  try {
    const {
      bookId,
      dateBorrowed,
      bookowner_id,
      bookborrower_id,
      dateDueForReturn,
      bookStatus,
    } = req.body;
    const request = new Request(
      `INSERT INTO booksOutOnLoan(bookId, dateBorrowed, bookowner_id,  bookborrower_id, dateDueForReturn, bookStatus, dateReturned) VALUES (@bookId, @dateBorrowed, @bookowner_id, @bookborrower_id, @dateDueForReturn, @bookStatus, @dateReturned)
      SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY]`,
      (err, rowCount, row) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(rowCount + " added");
          res.json({
            message: "Chat initialized.",
            success: true,
            id: row,
          });
        }
      }
    );
    request.addParameter("bookId", TYPES.Int, bookId);
    request.addParameter("dateBorrowed", TYPES.Date, dateBorrowed);
    request.addParameter("bookowner_id", TYPES.Int, bookowner_id);
    request.addParameter("bookborrower_id", TYPES.Int, bookborrower_id);
    request.addParameter("dateDueForReturn", TYPES.Date, dateDueForReturn);
    request.addParameter("bookStatus", TYPES.Text, bookStatus);
    request.addParameter("dateReturned", TYPES.Date, null);

    connection.execSql(request);
  } catch {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

function listBook(req, res) {
  let bookList;
  const request = new Request(
    "SELECT * FROM allBooks where isDeleted = 'false' ",
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(bookList);
      } else {
        console.log(rowCount + " row(s) returned");
        bookList = rows;
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function listBooksByUserId(req, res) {
  let bookList;
  const request = new Request(
    `SELECT * FROM allBooks WHERE isDeleted = 'false' and user_id=${req.params.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(bookList);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          bookList.push(rowObject);
        }
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function deleteBookById(req, res) {
  const request = new Request(
    `UPDATE allBooks
    SET isDeleted = 1
    WHERE id=${req.body.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        res.json({ message: "success" });
      }
    }
  );
  connection.execSql(request);
}
//Return the booklist which is available and the returned book which was already loaned out.
function search(req, res) {
  const request = new Request(
    `SELECT allBooks.id AS bookId, allBooks.title, allBooks.authors, allBooks.physical_format, allBooks.condition, allBooks.comments, allBooks.user_id, Users.username, Users.latitude, Users.longitude from allBooks INNER JOIN Users ON allBooks.user_id=Users.id
    WHERE allBooks.id not in (select bookId from booksOutOnLoan where bookStatus not like 'returned' and bookStatus not like 'pending')
    AND allBooks.title like '%${req.params.title}%'
    AND allBooks.isDeleted=0`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function findUserByEmail(email) {
  let response;
  return new Promise((resolve, reject) => {
    const request = new Request(
      `SELECT * FROM Users WHERE email='${email}'`,
      (err, rowCount, row) => {
        if (err) {
          console.log(err.message, "hello");
          reject;
        } else {
          console.log(rowCount + " row(s) returned");
          if (!rowCount) {
            reject;
          } else {
            response = {};
            for (let col of row[0]) {
              let columnName = col.metadata.colName;
              response[columnName] = col.value;
            }
          }

          resolve(response);
        }
      }
    );
    connection.execSql(request);
  });
}
function addBook(req, res) {
  console.log(req.body);
  const {
    title,
    authors,
    isbn_13,
    isbn_10,
    physical_format,
    condition,
    comments,
    user_id,
  } = req.body;
  const request = new Request(
    `INSERT INTO allBooks (title, authors, isbn_13, isbn_10, physical_format, condition, comments, user_id) OUTPUT Inserted.ID VALUES (@title, @authors, @isbn_13, @isbn_10, @physical_format, @condition, @comments, @user_id)`,
    (error, rowCount, id) => {
      if (error) {
        console.log(error.message);
        res.json({ error, message: "nothing found" });
      } else {
        console.log(rowCount + " added");
        console.log(id[0][0].value);
        res.json({ title: req.body.title, id: id[0][0].value });
      }
    }
  );
  request.addParameter("title", TYPES.Text, title);
  request.addParameter("authors", TYPES.Text, authors);
  request.addParameter("isbn_13", TYPES.Text, isbn_13);
  request.addParameter("isbn_10", TYPES.Text, isbn_10);
  request.addParameter("physical_format", TYPES.Text, physical_format);
  request.addParameter("condition", TYPES.Text, condition);
  request.addParameter("comments", TYPES.Text, comments);
  request.addParameter("user_id", TYPES.Int, user_id);

  connection.execSql(request);
}

function createUser(req, res) {
  try {
    console.log(req.body);
    const { email, password, latitude, longitude } = req.body;
    const userName = req.body.username;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
      if (err) {
        console.log(err);
        return;
      }
      const request = new Request(
        `INSERT INTO Users (userName, email, password, latitude, longitude) VALUES (@userName, @email, @password, @latitude, @longitude)`,
        (err, rowCount, rows) => {
          if (err) {
            console.log("username or email already exists");
            res.json({
              message: "Username or email already exists. Please try again.",
              success: false,
            });
          } else {
            console.log(rowCount + " added");
            res.json({
              message: "Success! Please log in.",
              success: true,
            });
          }
        }
      );
      request.addParameter("userName", TYPES.Text, userName);
      request.addParameter("email", TYPES.Text, email);
      request.addParameter("password", TYPES.Text, hashedPassword);
      request.addParameter("latitude", TYPES.Float, latitude);
      request.addParameter("longitude", TYPES.Float, longitude);

      connection.execSql(request);
    });
  } catch {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.json({ message: "failed" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    console.log("login successful");
    // return jsonwebtoken
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        latitude: user.latitude,
        longitude: user.longitude,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({ message: "success" });
  } else {
    console.log("login failed");
    res.json({ message: "login failed" });
  }
}

async function logOut(req, res) {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function isLoggedIn(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.send(false);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      return res.json(user);
    });
  } catch (error) {
    res.send(false);
  }
}

function updatePostalCode(req, res) {
  const { latitude, longitude, userId } = req.body;
  const request = new Request(
    `UPDATE Users SET latitude = ${latitude}, longitude = ${longitude} WHERE id = ${userId}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log("Problem updating latitude or longitude.");
        res.json({
          message: "Problem updating latitude or longitude.",
          success: false,
        });
      } else {
        console.log(`Postal code successfully updated.`);
        res.json({
          message: `Postal code successfully updated.`,
          success: true,
        });
      }
    }
  );
  connection.execSql(request);
}

function getLentBooks(req, res) {
  const request = new Request(
    `WITH temp AS (SELECT booksOutOnLoan.dateBorrowed, booksOutOnLoan.book_borrowing_id, booksOutOnLoan.bookStatus, booksOutOnLoan.bookborrower_id, booksOutOnLoan.dateDueForReturn, allBooks.title, allBooks.authors, allBooks.condition FROM booksOutOnLoan INNER JOIN allBooks ON booksOutOnLoan.bookId = allBooks.id WHERE booksOutOnLoan.bookowner_id = ${req.params.id} AND booksOutOnLoan.dateReturned IS NULL AND (booksOutOnLoan.bookStatus LIKE 'Lend' OR booksOutOnLoan.bookStatus LIKE 'return')) 
    SELECT temp.*, Users.username FROM temp INNER JOIN Users ON temp.bookborrower_id = Users.id`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            if (
              columnName === "dateBorrowed" ||
              columnName === "dateDueForReturn"
            ) {
              rowObject[columnName] = `${col.value}`.slice(0, 10);
            } else {
              rowObject[columnName] = col.value;
            }
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function getBooksDueSoon(req, res) {
  const request = new Request(
    `WITH temp AS (Select allBooks.title, allBooks.authors, allBooks.id as bookId, allBooks.condition, 
      booksOutOnLoan.bookowner_id, booksOutOnLoan.bookStatus, booksOutOnLoan.dateBorrowed, booksOutOnLoan.dateDueForReturn, 
      DATEDIFF(DD, GETDATE(), booksOutOnLoan.dateDueForReturn) as daysLeftToReturn
      FROM allBooks  
      INNER JOIN 
      booksOutOnLoan on booksOutOnLoan.bookId=allBooks.id 
      WHERE booksOutOnLoan.bookborrower_id=${req.params.id}
      AND DATEDIFF(DD, GETDATE(), booksOutOnLoan.dateDueForReturn)<=4)
        SELECT temp.*, Users.username FROM temp INNER JOIN Users ON temp.bookowner_id=Users.id`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function getBooksRented(req, res) {
  const request = new Request(
    `WITH temp AS (Select allBooks.title, allBooks.authors, allBooks.id as bookId, allBooks.condition, booksOutOnLoan.book_borrowing_id,
      booksOutOnLoan.bookowner_id, booksOutOnLoan.dateBorrowed, booksOutOnLoan.bookStatus, booksOutOnLoan.dateDueForReturn, 
      DATEDIFF(DD, GETDATE(), booksOutOnLoan.dateDueForReturn) as daysLeftToReturn
      FROM allBooks  
      INNER JOIN 
      booksOutOnLoan on booksOutOnLoan.bookId=allBooks.id 
      WHERE booksOutOnLoan.bookborrower_id=${req.params.id} AND (booksOutOnLoan.bookStatus LIKE 'Lend' OR booksOutOnLoan.bookStatus LIKE 'return'))
        SELECT temp.*, Users.username FROM temp INNER JOIN Users ON temp.bookowner_id=Users.id`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            if (
              columnName === "dateBorrowed" ||
              columnName === "dateDueForReturn"
            ) {
              rowObject[columnName] = `${col.value}`.slice(0, 10);
            } else {
              rowObject[columnName] = col.value;
            }
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function getPendingRentals(req, res) {
  const request = new Request(
    `WITH temp AS (Select allBooks.title, allBooks.authors, allBooks.id as bookId, allBooks.condition, 
      booksOutOnLoan.bookowner_id, booksOutOnLoan.bookborrower_id, booksOutOnLoan.book_borrowing_id, booksOutOnLoan.dateBorrowed, booksOutOnLoan.dateDueForReturn, booksOutOnLoan.bookStatus
      FROM allBooks  
      INNER JOIN 
      booksOutOnLoan on booksOutOnLoan.bookId=allBooks.id 
      WHERE (booksOutOnLoan.bookborrower_id=${req.params.id} OR booksOutOnLoan.bookowner_id=${req.params.id}) AND (booksOutOnLoan.bookStatus LIKE 'pending' OR booksOutOnLoan.bookStatus LIKE 'reserved') AND booksOutOnLoan.dateReturned IS NULL)
        SELECT temp.*, Users.username, Users2.username as username2 FROM temp INNER JOIN Users ON temp.bookowner_id=Users.id INNER JOIN Users as Users2 ON bookborrower_id = Users2.id`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            if (
              columnName === "dateBorrowed" ||
              columnName === "dateDueForReturn"
            ) {
              if (col.value) {
                rowObject[columnName] = `${col.value}`.slice(0, 10);
              } else {
                rowObject[columnName] = col.value;
              }
            } else {
              rowObject[columnName] = col.value;
            }
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function updatePendingRental(req, res) {
  const request = new Request(
    `UPDATE booksOutOnLoan
    SET dateBorrowed = '${req.body.dateBorrowed}', dateDueForReturn = '${req.body.dateDueForReturn}', bookStatus = '${req.body.bookStatus}'
    WHERE book_borrowing_id = ${req.body.bookBorrowingId}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log({ message: err.message, success: false });
      } else {
        console.log(rowCount + " row(s) returned");
        res.json({ message: "success", success: true });
      }
    }
  );
  connection.execSql(request);
}

function updateRental(req, res) {
  const request = new Request(
    `UPDATE booksOutOnLoan
    SET bookStatus = '${req.body.bookStatus}'
    WHERE book_borrowing_id = ${req.body.bookBorrowingId}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json({ message: "failed", success: false });
      } else {
        console.log(rowCount + " row(s) returned");
        res.json({ message: "success", success: true });
      }
    }
  );
  connection.execSql(request);
}

function confirmReturn(req, res) {
  const request = new Request(
    `UPDATE booksOutOnLoan
    SET bookStatus = 'returned', dateReturned = getdate()
    WHERE book_borrowing_id = ${req.body.bookBorrowingId}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log({ message: "Error", success: false });
      } else {
        console.log(rowCount + " row(s) returned");
        res.json({ message: "success", success: true });
      }
    }
  );
  connection.execSql(request);
}

const deletePending = (req, res) => {
  const request = new Request(
    `DELETE FROM booksOutOnLoan WHERE ((bookowner_id=${req.body.userId} AND bookborrower_id=${req.body.id}) OR (bookowner_id=${req.body.id} AND bookborrower_id=${req.body.userId})) AND bookStatus LIKE 'pending'`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        res.json({ message: "success" });
      }
    }
  );
  connection.execSql(request);
};

export {
  addBook,
  listBook,
  search,
  createUser,
  logIn,
  listBooksByUserId,
  deleteBookById,
  logOut,
  isLoggedIn,
  updatePostalCode,
  bookOutOnLoan,
  getLentBooks,
  getBooksDueSoon,
  getBooksRented,
  getPendingRentals,
  updatePendingRental,
  updateRental,
  confirmReturn,
  deletePending,
};
