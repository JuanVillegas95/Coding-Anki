"use client";

import React from "react";
import WeeklyCalendar from "../components/WeeklyCalendar";
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
        <WeeklyCalendar />
      </Container>
    </>
  );
}
