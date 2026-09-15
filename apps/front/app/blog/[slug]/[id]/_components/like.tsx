"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostLikeData, likePost, unLikePost } from "@/lib/actions/like";
import { SessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";

type Props = {
  postId: number;
  user?: SessionUser;
};

type LikeData = {
  likeCount: number;
  userLikedPost: boolean;
};

type LikeMutationContext = {
  previous: LikeData | undefined;
};

const Like = ({ postId, user }: Props) => {
  const queryClient = useQueryClient();
  const [justLiked, setJustLiked] = useState(false);
  const queryKey = ["GET_POST_LIKE_DATA", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: async () => await getPostLikeData(postId),
  });

  const toggleLike = useMutation<void, Error, boolean, LikeMutationContext>({
    mutationFn: async (liked) => {
      if (liked) {
        await unLikePost(postId);
      } else {
        await likePost(postId);
      }
    },
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<LikeData>(queryKey);

      queryClient.setQueryData<LikeData>(queryKey, (old) => ({
        likeCount: (old?.likeCount ?? 0) + (liked ? -1 : 1),
        userLikedPost: !liked,
      }));

      if (!liked) {
        setJustLiked(true);
        setTimeout(() => setJustLiked(false), 300);
      }

      return { previous };
    },
    onError: (_err, _liked, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const liked = data?.userLikedPost ?? false;
  const count = data?.likeCount ?? 0;

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-full"
        render={<Link href="/auth/signin" />}
      >
        <HugeiconsIcon icon={HeartIcon} className="size-4" />
        <span>{count > 0 ? count : "Like"}</span>
      </Button>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-6xl sm:mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={toggleLike.isPending}
        onClick={() => toggleLike.mutate(liked)}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
        className={cn(
          "gap-2 rounded-full transition-colors",
          liked &&
            "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-600",
        )}
      >
        <HugeiconsIcon
          icon={HeartIcon}
          className={cn(
            "size-4 transition-transform",
            liked && "fill-rose-600 text-rose-600",
            justLiked && "scale-125",
          )}
        />
        <span className="tabular-nums">{count}</span>
      </Button>
    </section>
  );
};

export default Like;
