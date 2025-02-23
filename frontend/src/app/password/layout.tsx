import TopBarNavigationComponent from "@/components/TopBarNavigationComponent";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBarNavigationComponent homeLink logoutLink />
      {children}
    </>
  );
}
