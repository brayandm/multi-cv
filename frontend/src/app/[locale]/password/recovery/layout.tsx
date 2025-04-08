import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function PasswordRecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar empty />
      </NavbarWrapper>
      <SpacerDefault />
      {children}
    </>
  );
}
