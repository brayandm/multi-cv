import SettingsComponent from "@/components/SettingsComponent";
import { NavbarWrapper, SpacerDefault } from "../../main.styles";
import Navbar from "@/shared/components/Navbar";

export default function Settings() {
  return (
    <>
      <NavbarWrapper>
        <Navbar settingsRoute />
      </NavbarWrapper>
      <SpacerDefault />
      <SettingsComponent />
    </>
  );
}
