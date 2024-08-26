"use client";

import React, { useEffect, useState } from "react";
import { useChat } from "ai/react";
import {
  TextField,
  Button,
  Box,
  CssBaseline,
  CircularProgress,
  Typography,
  Alert
} from "@mui/material";
import { Send } from "@mui/icons-material";

import ResponsiveAppBar from "@/components/appBar";
import MessageComponent from "@/components/message";

const HomePage: React.FC = () => {
  const { input, handleInputChange, handleSubmit, isLoading, messages, error } =
    useChat();

  const [currError, setCurrError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      console.error(error);
      setCurrError(error);
    }

  }, [error]);

  return (
    <>
      <CssBaseline />
      <ResponsiveAppBar />
      <Box sx={{ position: 'fixed', top: '2em', right: '2em', zIndex: 1300 }}>
        {
          currError ? <Alert severity="error" onClose={() => setCurrError(null)}>An error occurred, please contact the developer. {currError.name}</Alert> : null
        }
      </Box>
      <Box sx={{ height: "100%", pl: 0, m: 0, width: '100%', maxWidth: 'none' }}>
        <Box flex={1} overflow={"auto"} mb={"5rem"} width={{ xs: '100%', md: '80%', lg: '60%' }} mx={'auto'}>
          {messages.map((m, i) => (
            <MessageComponent key={`message ${i}`} message={m as any} />
          ))}
          {isLoading && messages.at(-1)?.role !== "assistant" ? (
            <CircularProgress size='2em' sx={{ p: .7 }} thickness={4} />
          ) : null}
        </Box>
        <Box alignSelf={"flex-end"} width={{ xs: 'calc(100% - 16px * 2)', sm: '80%' }} pb={3} position={"fixed"} bottom={0} left={{ xs: '16px', sm: '10%' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              multiline
              value={input}
              onChange={handleInputChange}
              maxRows={6}
              minRows={1}
              InputProps={{
                endAdornment: (
                  <Button variant="text" type="submit">
                    <Send color={isLoading ? "disabled" : "primary"} />
                  </Button>
                ),
              }}
              variant="standard"
              disabled={isLoading}
              sx={{ bgcolor: "white", width: "100%", "& textarea": { pl: 1 } }}
            />
          </form>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
