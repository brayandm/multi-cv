import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../../main.styles";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar homeRoute />
      </NavbarWrapper>
      {children}
    </>
  );
}
