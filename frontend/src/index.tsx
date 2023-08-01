import React from "react";
import "./assets/fonts/Font.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./assets/theme";

const isMobile = function () {
    const match = window.matchMedia("(pointer:coarse)");
    return match && match.matches;
};

const GlobalStyle = createGlobalStyle`
  html{
    font-size: ${
        isMobile() ? window.innerWidth / 390 : window.innerHeight / 1080
    }px;
  }
  body{
	margin: 0px;
  }
`;
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <>
        <ThemeProvider theme={theme}>
            <App />
            <GlobalStyle />
        </ThemeProvider>
    </>
);
