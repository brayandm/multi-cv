"use client";

import { styled } from "styled-components";

export const SpacerDefault = styled.div`
  height: 80px;
`;

export const NavbarWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

export const MaxWidthContainer = styled.div`
  display: flex;
  justify-content: center;
  :nth-child(1) {
    max-width: 600px;
    background-color: "red";
  }
`;
