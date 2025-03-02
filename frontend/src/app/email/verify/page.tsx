import EmailVerificationComponent from "@/components/EmailVerificationComponent";
import { api } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";
import { UserResponse } from "@/lib/types";
import { cookies } from "next/headers";

export default async function EmailVerification() {
  const authToken = (await cookies()).get(
    process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!
  );

  const data = await api.get<UserResponse>(userApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  return (
    <EmailVerificationComponent type={"verification"} email={data.data.email} />
  );
}
