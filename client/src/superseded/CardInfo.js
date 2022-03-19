import React from "react";
import BookCard from "./BookCard";
function CardInfo() {
  return (
    <div className="flex justify-center m-auto gap-4 w-screen-80px p-4">
      <BookCard name="Lend" address="" image="book1.jpg" />

      <BookCard name="Borrow" address="" image="book2.jpeg" />

      <BookCard name="Buy/Sell" address="" image="book3.jpg" />
    </div>
  );
}

export default CardInfo;
