import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarWrapper>
        <Navbar homeLink passwordLink logoutLink />
      </NavbarWrapper>
      {children}
    </div>
  );
}
