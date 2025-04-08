import PasswordComponent from "@/components/PasswordComponent";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
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
