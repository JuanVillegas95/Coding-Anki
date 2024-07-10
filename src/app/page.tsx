"use client";

import React from "react";
import CalendarHub from "@/components/CalendarHub"
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #FAECD4;
  }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;  
`;

export default function Home() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <CalendarHub />
      </Container>
    </>
  );
}
