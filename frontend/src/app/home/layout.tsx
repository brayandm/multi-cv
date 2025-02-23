import TopBarNavigationComponent from "@/components/TopBarNavigationComponent";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBarNavigationComponent passwordLink />
      {children}
    </>
  );
}
