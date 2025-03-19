import { NavbarWrapper } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function ProfileSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar profileRoute />
      </NavbarWrapper>
      {children}
    </>
  );
}
