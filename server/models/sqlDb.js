import dotenv from "dotenv";
dotenv.config();
import { Connection, TYPES } from "tedious";

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: process.env.AZURE_USERNAME,
      password: process.env.AZURE_PASSWORD,
    },
    type: "default",
  },
  server: process.env.SQL_SERVER,
  options: {
    database: process.env.SQL_DATABASE,
    encrypt: true,
    rowCollectionOnRequestCompletion: true,
  },
};

const connection = new Connection(config);
connection.on("connect", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected to SQL database");
  }
});
connection.connect();
export default connection;
