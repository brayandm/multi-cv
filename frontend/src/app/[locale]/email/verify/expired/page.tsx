import EmailVerificationComponent from "@/components/EmailVerificationComponent";

export default async function EmailVerificationExpired() {
  return <EmailVerificationComponent type={"expired"} />;
}
