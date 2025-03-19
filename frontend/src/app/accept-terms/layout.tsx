import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function AcceptTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar onlyLogout />
      </NavbarWrapper>
      {children}
    </>
  );
}
