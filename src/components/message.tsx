"use client";

import { ChatCompletionRequestMessageFunctionCall } from "openai-edge/types/api";
import React from "react";
import Markdown from "react-markdown";
import { Avatar, Box, Typography } from "@mui/material";
import { Computer } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";

type Prop = {
  message: {
    id: string;
    createdAt?: Date;
    content: string;
    role: "system" | "user" | "assistant" | "function";
    name?: string;
    function_call?: string | ChatCompletionRequestMessageFunctionCall;
  };
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
      <Box 
        sx={{
          whiteSpace: 'pre-wrap',
          '& li': {
            whiteSpace: 'normal',
            ml: 3
          },
          '& :not(pre) > code': {
            p: '0.1em 0.2em', 
            backgroundColor: '#f2f2f2',
            borderRadius: '3px', 
            color: '#cc0000',
            fontFamily: 'Monaco, monospace',
            fontSize: '87%',
            fontWeight: 'bolder',
            verticalAlign: 'baseline'
          }
        }}
      >
        <Markdown
          components={{
 
          }}
        >
          {content}
        </Markdown>
      </Box>
    </Box>
  );
};

export default MessageComponent;
