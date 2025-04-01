import PasswordComponent from "@/components/PasswordComponent";
import { NavbarWrapper, SpacerDefault } from "../main.styles";
import Navbar from "@/shared/components/Navbar";

export default function Password() {
  return (
    <>
      <NavbarWrapper>
        <Navbar settingsRoute />
      </NavbarWrapper>
      <SpacerDefault />
      <PasswordComponent />
    </>
  );
}
