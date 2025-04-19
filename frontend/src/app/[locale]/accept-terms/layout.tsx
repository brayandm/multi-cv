import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";

export default function AcceptTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar deleteAccount onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      {children}
    </>
  );
}
