'use client';

import { createGlobalStyle } from 'styled-components';
import { colors, fonts } from '@/lib/theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    background: ${colors.cream};
    color: ${colors.text};
    font-family: ${fonts.sans};
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5 {
    margin: 0;
    font-family: ${fonts.display};
    font-weight: 500;
    letter-spacing: -0.025em;
    line-height: 1.08;
    color: ${colors.ink};
  }

  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul, ol {
    margin: 0;
    padding: 0;
  }

  ::selection {
    background: ${colors.copperSoft};
    color: ${colors.ink};
  }

  :focus-visible {
    outline: 2px solid ${colors.copper};
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #D7D2C6;
    border-radius: 99px;
    border: 2px solid ${colors.cream};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #BFB8A9;
  }

  .no-scrollbar {
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;
