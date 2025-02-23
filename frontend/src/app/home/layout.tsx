import { TopBarNavigation } from "../main.styles";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBarNavigation></TopBarNavigation>
      {children}
    </>
  );
}
