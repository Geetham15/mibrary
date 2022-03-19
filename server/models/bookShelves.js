import mongoose from "./mongooseDb.js";

const BookShelves = mongoose.model("BookShelves", {
  title: { type: String, required: true },
  description: String,
  authors: { type: String, required: true },
  isbn: String,
  binding: String,
  publisher: String,
  published: String,
  condition: String,
  comments: String,
  subjects: Array,
  location: Object,
});

export default BookShelves;
