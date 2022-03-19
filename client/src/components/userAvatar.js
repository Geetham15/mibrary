import { React } from "react";
import { Avatar, Stack } from "@mui/material";

const userAvatar = () => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Avatar alt="User" src="/static/images/avatar/1.jpg"></Avatar>
      </Stack>
    </>
  );
};

export default userAvatar;
