// components/MyForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCountdown } from "usehooks-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { resendEmaill, SigninAction } from "@/app/authenticate/auth-action";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function Signin() {
  //use state
  const [emailNotverified, setEmailNotverified] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const [countdown, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 10,
    intervalMs: 1000,
  });

  useEffect(() => {
    if (countdown == 0) {
      resetCountdown();
      setIsResending(false);
    }
  }, [countdown]);

  const router = useRouter();
  const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const res = await SigninAction(data);
    if (res.success) {
      router.push("/");
      toast.success("Email is correct");
    } else if (res.error === "Email not verified") {
      toast.error(res.error);
      setEmailNotverified(true);
    } else {
      toast.error(res.error);
    }
  };

  const resendEmail = async () => {
    const email = form.getValues("email");
    const res = await resendEmaill(email);
    if (res.success) {
      toast.success("Verification email is sent");
      startCountdown();
      setIsResending(true);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter details to Sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      {...field}
                      //   className="h-input-lg text-input-lg px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting" : "Submit"}
              {form.formState.isSubmitting && (
                <LoaderCircle className="animate-spin" />
              )}
            </Button>
          </form>
          {emailNotverified && (
            <Button
              variant={"link"}
              className="mt-4 block w-full"
              onClick={resendEmail}
              disabled={isResending}
            >
              Resend Verification Email
            </Button>
          )}
          {isResending && (
            <p className="text-center">
              Please wait <span className="font-semibold">{countdown}</span>s
              before resending
            </p>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
