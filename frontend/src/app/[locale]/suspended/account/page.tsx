import SuspendedAccountComponent from "@/components/SuspendedAccountComponent";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function SuspendedAccount() {
  return (
    <>
      <NavbarWrapper>
        <Navbar onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      <SuspendedAccountComponent />
    </>
  );
}
