import { NavbarWrapper } from "@/app/main.styles";
import EditCvComponent from "@/components/EditCvComponent";
import Navbar from "@/shared/components/Navbar";

export default async function EditCv() {
  return (
    <>
      <NavbarWrapper>
        <Navbar homeRoute />
      </NavbarWrapper>
      <EditCvComponent />
    </>
  );
}
