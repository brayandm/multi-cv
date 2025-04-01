import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";

export default function ProfileAutoFillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      {children}
    </>
  );
}
