import Signin from "@/components/Signin";
import Signup from "@/components/Signup";
import TabSwitcher from "@/components/TabSwitcher";
import { getUser } from "@/app/lib/lucia";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getUser();
  if (user?.user) return redirect("/dashboard");
  return (
    <div className="grid justify-center mt-7 w-full px-3">
      <TabSwitcher SignIn={<Signin />} SignUp={<Signup />} />
    </div>
  );
}
