"use client";
import {Message} from "api";
import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Computer } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";

type Prop = {
  message: Message
};
const MessageComponent: React.FC<Prop> = ({ message }) => {
  const { role, content } = message;
  return (
    <Box
      padding={1}
      bgcolor={role == "user" ? undefined : blue[100]}
      borderRadius={1}
    >
      {role === "assistant" ? (
        <Avatar sx={{ bgcolor: grey[500] }}>
          <Computer />
        </Avatar>
      ) : (
        <Avatar sx={{ bgcolor: blue[500] }}>您</Avatar>
      )}
      <Typography sx={{whiteSpace: "pre-wrap"}}>{content}</Typography>
    </Box>
  );
};

export default MessageComponent;
