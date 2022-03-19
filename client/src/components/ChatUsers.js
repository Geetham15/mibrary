import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Divider, Badge } from "@mui/material";
import AlertDialog from "./AlertDialog.js";
import { useState } from "react";

const ChatUsers = ({
  users,
  setChattingWith,
  deleteConversation,
  newMessages,
  setNewMessages,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  return (
    <div>
      {users.map((user) => {
        return (
          <div key={user.id} style={{ cursor: "pointer" }}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setIsAlertOpen(true)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Badge badgeContent={0} color="secondary">
                  <Avatar>{user.username[0].toUpperCase()}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                onClick={() => {
                  setChattingWith(user);
                  setNewMessages((old) => {
                    old[user.id] = 0;
                    return old;
                  });
                }}
              />
            </ListItem>
            <Divider />
            <AlertDialog
              isAlertOpen={isAlertOpen}
              setIsAlertOpen={setIsAlertOpen}
              userId={user.id}
              deleteConversation={deleteConversation}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChatUsers;
