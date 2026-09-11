"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";
import { useActionState } from "react";
import Link from "next/link";

const SignInForm = () => {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <form action={action} className="space-y-5">
      {!!state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="email@example.com"
          type="email"
          defaultValue={state?.data?.email}
        />
        {!!state?.error?.email && (
          <p className="text-sm text-destructive">{state.error.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          defaultValue={state?.data?.password}
        />
        {!!state?.error?.password && (
          <p className="text-sm text-destructive">{state.error.password}</p>
        )}
      </div>

      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
};

export default SignInForm;
