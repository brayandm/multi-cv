import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { serverPost } from "@/lib/backendApi";

export default async function Register({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  const userId = searchParams.id;
  const token = searchParams.token;

  if (userId && token) {
    const user = await serverPost(
      "/user-data/with-token",
      {
        user_id: userId,
        auth_token: token,
      },
      false
    );

    return (
      <RegisterForm
        nameData={user.data.name}
        emailData={user.data.email}
        token={token as string}
        oauth={true}
      />
    );
  }

  return <RegisterForm />;
}
