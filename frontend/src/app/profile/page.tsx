import ProfileComponent from "@/components/ProfileComponent";
import { NavbarWrapper } from "../main.styles";
import Navbar from "@/shared/components/Navbar";

export default async function Profile() {
  return (
    <>
      <NavbarWrapper>
        <Navbar profileRoute />
      </NavbarWrapper>
      <ProfileComponent isFirstLogin={false} />
    </>
  );
}
