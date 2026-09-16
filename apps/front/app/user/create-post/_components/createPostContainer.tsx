"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveNewPost } from "@/lib/actions/postActions";
import UpsertPostForm from "./upsertPostForm";

const CreatePostContainer = () => {
  const [state, action] = useActionState(saveNewPost, undefined);
  const router = useRouter();

  useEffect(() => {
    if (!state?.message) return;

    if (state.ok) {
      toast.success(state.message);
      router.push("/user/posts");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return <UpsertPostForm state={state} formAction={action} />;
};

export default CreatePostContainer;
