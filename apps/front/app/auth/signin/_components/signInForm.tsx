"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";
import { useActionState } from "react";

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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
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
