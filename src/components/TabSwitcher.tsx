"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
type Props = {
  SignIn: React.ReactNode;
  SignUp: React.ReactNode;
};

export default function TabSwitcher(props: Props) {
  return (
    <div>
      <Tabs defaultValue="sign-in" className="max-w-[400px] w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-up">{props.SignUp}</TabsContent>
        <TabsContent value="sign-in">{props.SignIn}</TabsContent>
      </Tabs>
    </div>
  );
}
