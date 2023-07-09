"use client";

import ResponsiveAppBar from "@/components/appBar";
import { Box, Container, Link, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Box padding={5}>
          <Typography variant="h4">关于/About</Typography>
          <Typography variant="body1">
            这是一个使用
            <Link href="https://sdk.vercel.ai/" component="a">
              vercel.ai
            </Link>
            搭建的GPT-4 API转发网站。您可以在此与GPT-4交互。
          </Typography>
          <Typography variant="body1">
            This is a website built using&nbsp;
            <Link href="https://sdk.vercel.ai/" component="a">
              vercel.ai
            </Link>
            . You can interact with GPT-4 here.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default AboutPage;
