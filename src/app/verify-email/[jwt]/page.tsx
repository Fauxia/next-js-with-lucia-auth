import { verifyEmail } from "../../authenticate/auth-action";

export default async function page({ params }: { params: { jwt: string } }) {
  const res = await verifyEmail(params.jwt);

  return (
    <div>
      {res === "userNotExists" && <p>User not exists</p>}
      {res === "alreadyVerified" && <p>User is already verified</p>}
      {res === "userVerified" && <p>User is verified</p>}
      {res === "somethingWrong" && <p>Someting went wrong</p>}
    </div>
  );
}
