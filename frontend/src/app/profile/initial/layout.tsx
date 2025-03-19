import { NavbarWrapper } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function ProfileInitialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarWrapper>
        <Navbar logoutLink />
      </NavbarWrapper>
      {children}
    </div>
  );
}
