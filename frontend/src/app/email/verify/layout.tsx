import { MarginTopContainer } from "@/app/main.styles";

export default function EmailVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarginTopContainer>{children}</MarginTopContainer>;
}
