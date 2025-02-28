import { MarginTopContainer } from "../main.styles";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarginTopContainer>{children}</MarginTopContainer>;
}
