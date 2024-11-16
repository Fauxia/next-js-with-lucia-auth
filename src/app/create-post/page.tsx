import CreatePost from "@/components/CreatePost";
import { redirect } from "next/navigation";

export default async function page() {
  return (
    <div>
      <CreatePost />
    </div>
  );
}
