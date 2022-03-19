import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";

function getRating(req, res) {
  const request = new Request(
    `SELECT ROUND(AVG(CAST(rating AS FLOAT)), 2) FROM ratings where recipient_id =  ${req.params.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(err.message);
      } else {
        console.log(rowCount + " row(s) returned");
        console.log(rows);
        res.json(rows);
      }
    }
  );
  connection.execSql(request);
}

function rateUser(req, res) {
  const request = new Request(
    `INSERT INTO ratings (rater_id, recipient_id, comment, rating) VALUES (@raterId, @recipientId, @comment, @rating)`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json({
          message: "rating failed",
          success: false,
        });
      } else {
        console.log(rowCount + " added");
        res.json({
          message: "Rating successful.",
          success: true,
        });
      }
    }
  );
  request.addParameter("raterId", TYPES.Int, req.body.raterId);
  request.addParameter("recipientId", TYPES.Int, req.body.recipientId);
  request.addParameter("comment", TYPES.Text, req.body.comment);
  request.addParameter("rating", TYPES.Int, req.body.rating);

  connection.execSql(request);
}

export { getRating, rateUser };
