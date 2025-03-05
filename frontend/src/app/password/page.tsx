import PasswordComponent from "@/components/PasswordComponent";
import { NavbarWrapper } from "../main.styles";
import Navbar from "@/shared/components/Navbar";

export default function Password() {
  return (
    <>
      <NavbarWrapper>
        <Navbar profileLink homeLink logoutLink />
      </NavbarWrapper>
      <PasswordComponent />
    </>
  );
}
