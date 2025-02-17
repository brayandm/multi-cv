
import React, { ReactNode } from "react";
import { ExtensionContainer, TopBarNavigation } from "./main.styles";

interface Props {
    children: ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
    return <ExtensionContainer>
        <TopBarNavigation>
            {/* <ReturnIcon>
                <img src="icons/back.svg"></img>
            </ReturnIcon> */}
        </TopBarNavigation>
        {children}
    </ExtensionContainer>;
};

export default MainLayout;
