import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar empty />
      </NavbarWrapper>
      {children}
    </>
  );
}
