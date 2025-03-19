import ProfileComponent from "@/components/ProfileComponent";

export default async function ProfileInitial() {
  return (
    <>
      <ProfileComponent isFirstLogin={true} />
    </>
  );
}
