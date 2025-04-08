import ProfileComponent from "@/components/ProfileComponent";
import { NavbarWrapper, SpacerDefault } from "../../main.styles";
import Navbar from "@/shared/components/Navbar";

export default async function Profile() {
  return (
    <>
      <NavbarWrapper>
        <Navbar profileRoute />
      </NavbarWrapper>
      <SpacerDefault />
      <ProfileComponent isFirstLogin={false} />
    </>
  );
}
