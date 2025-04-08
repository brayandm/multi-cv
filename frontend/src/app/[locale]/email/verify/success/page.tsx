import EmailVerificationComponent from "@/components/EmailVerificationComponent";
import { api } from "@/lib/backendService";
import { userStatusApiLink } from "@/lib/links";
import { UserStatusResponse } from "@/lib/types";
import { cookies } from "next/headers";

export default async function EmailVerificationSuccess() {
  const authToken = (await cookies()).get(
    process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!
  );

  const data = await api.get<UserStatusResponse>(userStatusApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  return (
    <EmailVerificationComponent type={"success"} email={data.data.email!} />
  );
}
