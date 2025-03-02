import EmailVerificationComponent from "@/components/EmailVerificationComponent";
import { api } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";
import { UserResponse } from "@/lib/types";
import { cookies } from "next/headers";

export default async function EmailVerificationSuccess() {
  const authToken = (await cookies()).get(process.env.AUTH_COOKIE_NAME!);

  const data = await api.get<UserResponse>(userApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  return (
    <EmailVerificationComponent type={"success"} email={data.data.email} />
  );
}
