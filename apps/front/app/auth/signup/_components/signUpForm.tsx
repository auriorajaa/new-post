"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions/auth";
import { useActionState } from "react";

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);

  return (
    <form action={action} className="space-y-5">
      {!!state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          defaultValue={state?.data?.name}
        />
        {!!state?.error?.name && (
          <p className="text-sm text-destructive">{state.error.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="email@example.com"
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
          <ul className="space-y-1 text-sm text-destructive">
            {state.error.password.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      <SubmitButton className="w-full">Sign Up</SubmitButton>
    </form>
  );
};

export default SignUpForm;
