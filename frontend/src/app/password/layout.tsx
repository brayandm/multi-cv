import Navbar from "@/components/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar passwordLink logoutLink />
      </NavbarWrapper>
      {children}
    </>
  );
}
