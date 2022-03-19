import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MustBeLoggedIn from "./MustBeLoggedIn";
import { Badge } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AuthenticationContext from "../AuthenticationContext";

function Footer({ setIsChatOpen, socket }) {
  const handleChatClick = () => {
    setIsChatOpen((old) => {
      return !old;
    });
  };
  const [badgeContent, setBadgeContent] = useState(0);
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (authContext.userId) {
      socket.current.on("getMessage", (data) => {
        setBadgeContent((old) => (old += 1));
      });
    }
  }, []);

  return (
    <div>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar className=" p-5 mr-4 items-center flex justify-between  ">
          <Typography variant="subtitle" position="static">
            2022 © MiBrary by Team TARDIS
          </Typography>

          <MustBeLoggedIn>
            <Badge badgeContent={badgeContent} color="secondary">
              <ChatBubbleIcon
                cursor="pointer"
                onClick={() => {
                  handleChatClick();
                  setBadgeContent(0);
                }}
              />
            </Badge>
          </MustBeLoggedIn>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Footer;
