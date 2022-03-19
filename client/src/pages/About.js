import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Problem = () => {
  return (
    <CardContent>
      <Typography variant="h3" component="div">
        The Problem
      </Typography>
      <br />
      <Typography
        variant="body1"
        sx={{ textAlign: "left", lineHeight: "200%" }}
      >
        Want to read a book but can't find it in the public library or local
        bookstore? All you want to do is borrow and read it, not purchase it.
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        Looking for a classic novel that is no longer in print? Surely, someone
        near you must have it. But how would you go about looking for it?
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        You could send a message on social media to ask if anyone has the book
        you are looking for. Good luck getting any response from people who do
        not even know you! What about if there was an easier way for you to find
        the book somewhere near you that someone was willing to lend out?
      </Typography>
    </CardContent>
  );
};

const ImperfectSolution = () => {
  return (
    <CardContent>
      <Typography sx={{ textAlign: "center" }} variant="h3">
        Imperfect Solution
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        You may have seen or even used the community book sharing boxes where
        people place books they no longer need for anyone interested to take
        home. While the community book box is an excellent idea, it has a two
        main drawbacks: most of them are not large enough to hold the books
        people would like to give away, and it's impossible to know what's in
        the box unless you inspect it physically.
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        Who has the time to go from box to box hoping by some chance to find a
        particular book? If only there was a way to record and catalog all the
        books in the boxes...
      </Typography>
    </CardContent>
  );
};

const Solution = () => {
  return (
    <CardContent>
      <Typography sx={{ textAlign: "center" }} variant="h3">
        Solution
      </Typography>
      <br />
      <Typography variant="h6" sx={{ textAlign: "left" }}>
        Turn the world into a giant library!
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        <strong>MiBrary</strong> is an online, community-based, non-centralized
        library system where users can register and browse from a collection of
        privately held books. It's as simple as searching for a book, finding it
        on the map, and arranging a meeting time and place to borrow it!
      </Typography>
      <br />
      <Typography sx={{ textAlign: "left", lineHeight: "200%" }}>
        This system will encourage readership and promote a community spirit of
        sharing and exchanging books. And who knows who you'll meet along the
        way?
      </Typography>
    </CardContent>
  );
};

export default function About() {
  const [page, setPage] = useState(0);
  const changePage = () => {
    if (page < 2) {
      setPage((old) => {
        return (old += 1);
      });
    } else {
      setPage(0);
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} sx={{ marginTop: 2 }}>
            <Item>
              <Item>
                {page === 0 && <Problem />}
                {page === 1 && <ImperfectSolution />}
                {page === 2 && <Solution />}
              </Item>
              <CardActions
                sx={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button onClick={changePage}>Next</Button>
              </CardActions>
            </Item>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>
    </>
  );
}
