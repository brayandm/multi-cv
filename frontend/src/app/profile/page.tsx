import ProfileComponent from "@/components/ProfileComponent";
import Navbar from "@/components/shared/components/Navbar";

export default function Profile() {
  return (
    <>
      <Navbar homeLink passwordLink logoutLink></Navbar>
      <ProfileComponent />
    </>
  );
}
