import { getUser } from "@/app/lib/lucia";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getUser();
  if (!user) {
    return redirect("/authenticate");
  }
  return (
    <div>
      <h1>{user?.user?.name}</h1>
      <p>{user?.user?.email}</p>
    </div>
  );
}
