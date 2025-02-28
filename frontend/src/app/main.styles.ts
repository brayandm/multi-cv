"use client";

import { styled } from "styled-components";

export const MarginTopContainer = styled.div`
  margin-top: 60px;
`;

export const MaxWidthContainer = styled.div`
  display: flex;
  justify-content: center;
  :nth-child(1) {
    max-width: 600px;
    background-color: "red";
  }
`;
