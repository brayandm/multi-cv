import { styled } from "styled-components";

export const ExtensionContainer = styled.div<{
  width: string;
  height: string;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: 20px;
  overflow-y: auto;
  margin: auto;
`;
export const TopBarNavigation = styled.div`
  position: fixed;
  top: 0;
  width: 300px;
  padding: 20px;
`;
export const ReturnIcon = styled.div`
  height: 30px;
  width: 30px;
`;
