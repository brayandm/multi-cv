import { MarginTopContainer } from "../main.styles";

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarginTopContainer>{children}</MarginTopContainer>;
}
