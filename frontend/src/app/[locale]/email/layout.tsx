import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";

export default function EmailLayout({
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
