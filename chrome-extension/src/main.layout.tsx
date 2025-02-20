import React, { ReactNode } from "react";
import { ExtensionContainer, TopBarNavigation } from "./main.styles";

interface Props {
  children: ReactNode;
  width: string;
  height: string;
}

const MainLayout: React.FC<Props> = ({ children, width, height }) => {
  return (
    <ExtensionContainer width={width} height={height}>
      <TopBarNavigation>
        {/* <ReturnIcon>
                <img src="icons/back.svg"></img>
            </ReturnIcon> */}
      </TopBarNavigation>
      {children}
    </ExtensionContainer>
  );
};

export default MainLayout;
