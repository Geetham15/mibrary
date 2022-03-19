import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BookList from "../components/BookList";

const BookCard = (props) => {
  //  const {name,author,condition, comments} = props
  // eslint-disable-next-line no-unused-vars
  const [bookInfo, setBookInfo] = useState([]);

  useEffect(() => {
    async function getBookInfo() {
      let fetchInfo = await fetch("/api/bookList");
      let bookInfo = await fetchInfo.json();
      setBookInfo(bookInfo);
      console.log(bookInfo);
    }
    getBookInfo();
  }, []);

  return (
    <>
      )}
      {/* <div className="card" style={{ background: "White" }}>
      <h1 className=" flex justify-center items-center text-2xl p-2 font-bold w-full text-center">
        {props.name}
      </h1>
      <img
        className="w-96 h-96 flex justify-center items-center w-full "
        alt="app-logo"
        src={`${process.env.PUBLIC_URL} images/${props.image}`}
        style={{ padding: 20 }}
      />

      <h1 className=" flex justify-center items-center">{props.address}</h1>
    </div> */}
    </>
  );
};

export default BookCard;
