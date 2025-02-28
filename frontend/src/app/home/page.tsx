import HomeComponent from "@/components/HomeComponent";
import Navbar from "@/components/shared/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar passwordLink logoutLink />
      <HomeComponent />
    </>
  );
}
