import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/bookRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 5050;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
