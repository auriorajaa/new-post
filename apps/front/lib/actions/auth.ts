"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import { SignUpFormState } from "../types/formState";
import { SignUpFormSchema } from "../zodSchemas/signUpFormSchema";
import { CREATE_USER_MUTATION, SIGN_IN_MUTATION } from "../gqlQueries";
import { redirect } from "next/navigation";
import { LoginFormSchema } from "../zodSchemas/signInFormSchema";
import { revalidatePath } from "next/cache";

export async function signUp(
  state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const validatedFields = SignUpFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      error: validatedFields.error.flatten().fieldErrors,
    };

  const data = await fetchGraphQL(print(CREATE_USER_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data.error)
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Something went wrong",
    };

  redirect("/auth/signin");
}

export async function signIn(
  state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      error: validatedFields.error.flatten().fieldErrors,
    };

  const { data, errors } = await fetchGraphQL(print(SIGN_IN_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Invalid credentials",
    };
  }

  // TODO: Saved user session

  revalidatePath("/");
  redirect("/");
}
