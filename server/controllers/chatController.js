import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";

const sendChat = (req, res) => {
  const { fromUserId, toUserId, message } = req.body;
  const request = new Request(
    `INSERT INTO chats (fromUserId, toUserId, message, dateAndTime)
  VALUES (@fromUserId, @toUserId, @message, DEFAULT)`,
    (err, rowCount, row) => {
      if (err) {
        console.log(err.message);
        console.log({ message: "failed" });
        res.json({ message: "failed" });
      } else {
        console.log(rowCount + " added");
        console.log({ message: "success" });
        res.json({ message: "success" });
      }
    }
  );
  request.addParameter("fromUserId", TYPES.Int, fromUserId);
  request.addParameter("toUserId", TYPES.Int, toUserId);
  request.addParameter("message", TYPES.Text, message);

  connection.execSql(request);
};

const loadChats = (req, res) => {
  const fromUserId = req.query.fromUserId;
  const toUserId = req.query.toUserId;
  const request = new Request(
    `SELECT * FROM chats WHERE (fromUserId = ${fromUserId} AND toUserId = ${toUserId}) OR (toUserId = ${fromUserId} AND fromUserId = ${toUserId})`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        let chatList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          chatList.push(rowObject);
        }
        res.json(chatList);
      }
    }
  );
  connection.execSql(request);
};

const loadUsers = (req, res) => {
  let userList = [];
  const request = new Request(
    `WITH temporary AS (SELECT DISTINCT Users.id, Users.username, chats.fromUserId, chats.toUserId FROM chats INNER JOIN Users ON chats.fromUserId = Users.id WHERE Users.id = ${req.params.id})
    SELECT temporary.toUserId, Users.id, Users.username FROM Users INNER JOIN temporary ON temporary.toUserid = Users.id`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(rows);
        console.log(err.message);
        res.json(userList);
      } else {
        console.log(rowCount + " row(s) returned");
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          userList.push(rowObject);
        }
        res.json(userList);
      }
    }
  );
  connection.execSql(request);
};

const deleteConversation = (req, res) => {
  const request = new Request(
    `DELETE FROM chats WHERE (fromUserId=${req.body.userId} AND toUserId=${req.body.id}) OR (fromUserId=${req.body.id} AND toUserId=${req.body.userId})`,
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

export { sendChat, loadChats, loadUsers, deleteConversation };
