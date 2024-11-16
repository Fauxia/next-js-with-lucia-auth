import Signin from "@/components/Signin";
import Signup from "@/components/Signup";
import TabSwitcher from "@/components/TabSwitcher";

export default function page() {
  return (
    <div>
      <TabSwitcher SignIn={<Signin />} SignUp={<Signup />} />
    </div>
  );
}
