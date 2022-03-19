import mongoose from "mongoose";

const dbUrl =
  "mongodb+srv://admin:TNUrD18jwWc54q02@mibrary.e7agz.mongodb.net/mibrary";
// "mongodb://localhost:27017/mibrary";

mongoose.connect(dbUrl);

export default mongoose;
