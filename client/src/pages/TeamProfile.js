import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),

  color: theme.palette.text.secondary,
}));
function teamProfile() {
  return (
    <>
    
      <h1 className="text-5xl text-center pt-4">Team T.A.R.D.I.S</h1>
      <h3 className="text-2xl text-center pt-4">(Totally Awesome Revolutionary Developers Innovating Software)</h3>
    
   
    
      <Box sx={{ flexGrow: 1, mx:3, my:15, px:1 , py:1}}>
        <Grid container spacing={2}>
        <Grid item xs={1} className="text-center "></Grid>
        <Grid item xs={2} className="text-center ">
            <Item >Team Lead: Chris Desmarais
</Item>
            <Item> 
              <img src="./images/Chris_Portrait.png"  />
              <Item>
              <h3 ><strong>Senior developer at DuckLabs</strong></h3>
                <p>Chris enjoys helping new developers take flight
                </p><br/>
                
              </Item>
            </Item>
            <Grid item xs={2} className="text-center"></Grid>
          </Grid>
         <Grid item xs={2} className="text-center">
            <Item >Geetha Muniswamy</Item>
            <Item> 
              <img src="./images/Geetha_noBg.png" />
              <Item>
              <h3 ><strong>IT Professional</strong></h3>
                <p>Programmer Analyst</p>
                {/* <p>
                  Continuous learner always enthusiastic to obtain new skills
                </p> */}
                <p>Former Student developer in CNRL.</p>
                <p>Experienced CSR</p>
              </Item>
            </Item>
          </Grid>

          <Grid item xs={2} className="text-center">
            <Item className="text-center">Koltan Huget</Item>
            <Item>
              <img src="./images/Koltan_no_bg.png" className="pt-1"  />
              <Item>
              <h3 ><strong>Chemical Engineer</strong></h3>
                <p>Former engineer
</p>
                <p>Experienced tree planter
</p>
                <p>Keen interest in tech and programing</p>
                
              </Item>
            </Item>
          </Grid>

          <Grid item xs={2} className="text-center">
            <Item >John Alai</Item>
            <Item>
              <img src="./images/John_no_bg.png" />
              <Item>
              <h3 ><strong>Geomatics Engineer</strong></h3>
                <p>Keen interest in software development
</p>
                <p>Health and Fitness Instructor
</p>
                <p>Interested in public speaking
</p>

              </Item>
            </Item>
          </Grid>

          <Grid item xs={2}className="text-center">
            <Item className="text-center">Clayton Balzer</Item>
            <Item>
              <img src="./images/Clayton_noBg.png" />
              <Item>
              <h3 ><strong>Production & Logistics</strong></h3>
                <p>Loves computers and gaming</p>
                <p>COMPTIA certifications in A+ and N+</p>
                <p>Self-taught web designer
</p>
              </Item>
            </Item>
          </Grid>
        </Grid>
      </Box>

    </>
  );
}

export default teamProfile;
