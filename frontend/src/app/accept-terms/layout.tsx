import { MarginTopContainer } from "../main.styles";

export default function AcceptTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarginTopContainer>{children}</MarginTopContainer>;
}
