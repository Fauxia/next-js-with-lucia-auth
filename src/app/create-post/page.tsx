import CreatePost from "@/components/CreatePost";
import { redirect } from "next/navigation";
import { getUser } from "../lib/lucia";

export default async function page() {
  const user = await getUser();
  if (!user.user) {
    return redirect("/authenticate");
  }
  return (
    <div>
      <CreatePost />
    </div>
  );
}
