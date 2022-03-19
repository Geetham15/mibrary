import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

function ProblemCard(){
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
        <Item>
              <Item>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 24, textAlign: "center" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    <h1>Welcome to MiBrary</h1>
                    <blockquote> 'where the world is your library'</blockquote>
                  </Typography>
                  <Typography variant="h5" component="div">
                    <h1 className="text-center">
                      <strong>The Problem</strong>
                    </h1>
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <p>
                      Want to read a book but could not find it in the public
                      library, local or online bookstore?
                    </p>
                  </Typography>
                  <Typography variant="body1">
                    <p>
                      {
                        "all you wanted to do was to borrow and read it, not purchase it."
                      }
                    </p>

                    <br />
                  </Typography>
                  <Typography>
                    <p>
                      Looking for a classic novel that is no longer in print.
                    </p>{" "}
                    <p>Surely, someone near you must have it.</p>{" "}
                    <p>But how would you go about looking for it?</p>{" "}
                    <p>
                      You could send a message on social media to ask if anyone
                      has the book you are looking for.
                    </p>{" "}
                    <p>
                      Good luck getting any response from people who do not even
                      know you!
                    </p>
                    <p>
                      What about if there was an easier way for you to find the
                      book somewhere near you that someone was willing to lend
                      out?
                    </p>
                  </Typography>
                </CardContent>
              </Item>
              <CardActions>
                <Button
                 
                >
                  Next
                </Button>
              </CardActions>
            </Item>  
        </Grid>
        </Grid> 
    </Box>
}

function PaginationComponent() {
  return(
      <ProblemCard/>
  )
}

export default PaginationComponent;
