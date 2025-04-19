import AccountSuspendedComponent from "@/components/AccountSuspendedComponent";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function AccountSuspended() {
  return (
    <>
      <NavbarWrapper>
        <Navbar deleteAccount onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      <AccountSuspendedComponent />
    </>
  );
}
