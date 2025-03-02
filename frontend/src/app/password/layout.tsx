import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar homeLink logoutLink />
      </NavbarWrapper>
      {children}
    </>
  );
}
