"use client";

import React from "react";
import { useChat } from "ai/react";
import {
  Container,
  TextField,
  Button,
  Grid,
  List,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";

import ResponsiveAppBar from "@/components/appBar";
import MessageComponent from "@/components/message";

const HomePage: React.FC = () => {
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat();

  return (
    <Grid
      container
      height={"100%"}
      width={"100vw"}
      flexDirection={"column"}
      position={"absolute"}
    >
      <Grid item>
        <ResponsiveAppBar />
      </Grid>

      <Grid item flex={1} overflow={"auto"}>
        <Container sx={{ height: "100%" }}>
          <Grid width="100%" height="100%" container flexDirection={"column"}>
            <Grid item flex={1} overflow={"auto"}>
              <List>
                {messages.map((m, i) => (
                  <MessageComponent key={`message ${i}`} message={m} />
                ))}
                {isLoading && messages.at(-1)?.role !== "assistant" ? (
                  <Typography>加载中...</Typography>
                ) : null}
              </List>
            </Grid>
            <Grid item alignSelf={"flex-end"} width={"100%"} paddingBottom={3}>
              <form onSubmit={handleSubmit}>
                <TextField
                  multiline
                  value={input}
                  onChange={handleInputChange}
                  maxRows={4}
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
                  sx={{ bgcolor: "white", width: "100%" }}
                />
              </form>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default HomePage;
