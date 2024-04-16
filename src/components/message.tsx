"use client";
import {Message} from "api";
import React from "react";
import Markdown from "react-markdown";
import { Avatar, Box } from "@mui/material";
import { Computer } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";
import CodeBlock from "@/components/codeBlock";
import CopyButton from "./copyButton";

type Prop = {
  message: Message
};
const MessageComponent: React.FC<Prop> = ({ message }) => {
  const { role, content } = message;
  return (
    <Box
      py={2}
      px={{ xs: 1.5, sm: 2.5 }}
      boxSizing={'border-box'}
      bgcolor={role == "user" ? undefined : blue[100]}
      width={'100%'}
      borderRadius={1}
    >

      {role === "assistant" ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Avatar sx={{ bgcolor: grey[500] }}>
              <Computer />
            </Avatar>
          </Box>
          <Box>
            <CopyButton text={content} />
          </Box>
        </Box>
      ) : (
        <Avatar sx={{ bgcolor: blue[500] }}>您</Avatar>
      )}
      <Box
        sx={{
          whiteSpace: 'pre-wrap',
          '& ul, ol': {
            whiteSpace: 'normal',
            ml: 3,
            lineHeight: 1.3
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
            code(props) {
              const { children, className } = props;
              const lang = (/language-(\w+)/.exec(className || ''))?.at(1);

              return lang ? <CodeBlock lang={lang} code={String(children).trimEnd()} /> : <code>{String(children)}</code>
            }
          }}
        >
          {content}
        </Markdown>
      </Box>
    </Box>
  );
};

export default MessageComponent;
