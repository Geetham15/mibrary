import React, { useContext, useState, useEffect } from "react";
import AuthenticationContext from "../AuthenticationContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import MustBeLoggedIn from "./MustBeLoggedIn";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import PendingIcon from "@mui/icons-material/Pending";

import { useNavigate } from "react-router-dom";

const NavBar = ({
  booksDueSoon,
  setTableDisplay,
  isPendingConfirmation,
  setBookData,
}) => {
  const authContext = useContext(AuthenticationContext);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();
  return (
    <AppBar position="static" height="100vh">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <HomeIcon
              fontSize="large"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center"></Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          ></Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Typography variant="h4">MiBrary</Typography>
            <Typography
              variant="subtitle2"
              style={{
                paddingLeft: 40,
              }}
            >
              the world is your library
            </Typography>
          </Box>
          {!authContext.userId && (
            <>
              <Button
                onClick={() => navigate("/signUp")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Log in
              </Button>
            </>
          )}
          <MustBeLoggedIn>
            {booksDueSoon && (
              <Tooltip title="book(s) due soon">
                <IconButton
                  onClick={() => {
                    setTableDisplay(3);
                    navigate("/userDashboard");
                  }}
                >
                  <AccessAlarmIcon style={{ color: "red" }} />
                </IconButton>
              </Tooltip>
            )}
            {isPendingConfirmation && (
              <Tooltip title="confirm rental">
                <IconButton
                  onClick={() => {
                    setTableDisplay(4);
                    navigate("/userDashboard");
                  }}
                >
                  <PendingIcon style={{ color: "red" }} />
                </IconButton>
              </Tooltip>
            )}
          </MustBeLoggedIn>
          <Button
            onClick={() => navigate("/about")}
            sx={{ my: 2, display: "block", color: "white" }}
          >
            About
          </Button>
          <MustBeLoggedIn>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    {authContext.userId &&
                      authContext.username[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                {/* <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseUserMenu();
                  }}
                >
                  Profile
                </MenuItem> */}
                {/* <MenuItem
                  onClick={() => {
                    navigate("/account");
                    handleCloseUserMenu();
                  }}
                >
                  Account
                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    navigate("/userDashboard");
                    handleCloseUserMenu();
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setBookData([]);
                    authContext.logOut();
                  }}
                >
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </MustBeLoggedIn>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
