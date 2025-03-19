import WelcomeComponent from "@/components/WelcomeComponent";
import { NavbarWrapper } from "./main.styles";
import Navbar from "@/shared/components/Navbar";

export default function Home() {
  return (
    <>
      <NavbarWrapper>
        <Navbar empty />
      </NavbarWrapper>
      <WelcomeComponent />
    </>
  );
}
