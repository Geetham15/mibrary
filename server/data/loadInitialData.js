import bookShelvesList from "./bookShelvesList.js";
import bookShelves from "../models/bookShelves.js";

async function addBook(book) {
  console.log("Adding a Book");
  let newBook = await new bookShelves(book);
  let result = await newBook.save();
  return result;
}

bookShelvesList.forEach(async (book) => {
  let bookId = await addBook(book);
  console.log("Added book with id", bookId);
});
