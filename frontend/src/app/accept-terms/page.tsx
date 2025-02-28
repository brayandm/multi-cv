import AcceptTermsComponent from "@/components/AcceptTermsComponent";
import { api } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";
import { UserResponse } from "@/lib/types";
import { cookies } from "next/headers";
export default async function AccepTerms() {
  const authToken = (await cookies()).get(process.env.AUTH_COOKIE_NAME!);

  const data = await api.get<UserResponse>(userApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  const acceptTerms = data.data.is_valid_terms_version;
  const noticeTerms = data.data.notice_new_terms_version;

  return (
    <AcceptTermsComponent acceptTerms={acceptTerms} noticeTerms={noticeTerms} />
  );
}
