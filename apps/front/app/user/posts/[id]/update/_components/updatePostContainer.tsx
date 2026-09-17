"use client";

import UpsertPostForm from "@/app/user/create-post/_components/upsertPostForm";
import { updatePost } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  post: Post;
};

const UpdatePostContainer = ({ post }: Props) => {
  const [state, action] = useActionState(updatePost, {
    data: {
      postId: post.id,
      title: post.title,
      content: post.content,
      published: post.published ? "on" : undefined,
      tags: post.tags?.map((tag) => tag.name).join(","),
      previousThumbnailUrl: post.thumbnail ?? undefined,
    },
  });
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

export default UpdatePostContainer;
