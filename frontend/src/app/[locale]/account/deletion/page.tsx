import AccountDeletionComponent from "@/components/AccountDeletionComponent";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function AccountDeletion() {
  return (
    <>
      <NavbarWrapper>
        <Navbar onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      <AccountDeletionComponent />
    </>
  );
}
