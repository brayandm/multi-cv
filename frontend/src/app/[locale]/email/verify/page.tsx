import { NavbarWrapper, SpacerDefault } from "@/app/main.styles";
import EmailVerificationComponent from "@/components/EmailVerificationComponent";
import { api } from "@/lib/backendService";
import { userStatusApiLink } from "@/lib/links";
import { UserStatusResponse } from "@/lib/types";
import Navbar from "@/shared/components/Navbar";
import { cookies } from "next/headers";

export default async function EmailVerification() {
  const authToken = (await cookies()).get(
    process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!
  );

  const data = await api.get<UserStatusResponse>(userStatusApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  return (
    <>
      <NavbarWrapper>
        <Navbar deleteAccount onlyLogout />
      </NavbarWrapper>
      <SpacerDefault />
      <EmailVerificationComponent
        type={"verification"}
        email={data.data.email!}
      />
    </>
  );
}
