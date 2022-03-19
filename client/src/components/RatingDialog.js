import { useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import RateUser from "./RateUser.js";
import { DialogContent, Typography } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogActions } from "@mui/material";
import AuthenticationContext from "../AuthenticationContext.js";
import MyRating from "./MyRating.js";

export default function RatingDialog({
  chattingWith,
  isRateUserOpen,
  setIsRateUserOpen,
}) {
  const handleClose = (value) => {
    setIsRateUserOpen(false);
  };

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userAverageRating, setUserAverageRating] = useState(null);
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    async function getRating() {
      let result = await fetch(`/api/getRating/${chattingWith.id}`);
      result = await result.json();
      console.log(result);
      setUserAverageRating(result[0][0].value);
    }
    getRating();
  }, []);

  const submitRating = async () => {
    let response = await fetch("/api/rateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raterId: authContext.userId,
        recipientId: chattingWith.id,
        rating,
        comment: review,
      }),
    });
    response = await response.json();
    console.log(response);
  };

  return (
    <div>
      <Dialog open={isRateUserOpen} onClose={handleClose}>
        <DialogTitle>Rate user</DialogTitle>
        <DialogContent>
          <Typography>User's average rating:</Typography>
          <MyRating myRating={userAverageRating} label="" />
          <DialogContentText>Rate this user.</DialogContentText>
          <RateUser rating={rating} setRating={setRating} />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write optional review of user here."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            onClick={() => {
              submitRating();
              handleClose();
            }}
          >
            Submit rating
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
