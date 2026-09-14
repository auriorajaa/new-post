"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "@/lib/actions/commentActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Comment01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CommentCard from "./commentCard";
import { SessionUser } from "@/lib/session";
import AddComment from "./addComment";

type Props = {
  postId: number;
  user?: SessionUser;
};

const Comments = ({ postId, user }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GET_POST_COMMENTS", postId, page],
    queryFn: async () =>
      await getPostComments({
        postId,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
      }),
  });

  const totalPages = data ? Math.ceil(data.count / DEFAULT_PAGE_SIZE) : 0;

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl sm:mt-20">
      <Separator className="mb-10" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            Comments{!isLoading && data ? ` (${data.count})` : ""}
          </h2>

          {!!user && (
            <AddComment user={user} postId={postId} refetch={refetch} />
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 sm:gap-4">
                <Skeleton className="size-8 shrink-0 rounded-full sm:size-9" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-full max-w-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && data?.comments.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
            <HugeiconsIcon
              icon={Comment01Icon}
              className="size-6 text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to share your thoughts.
            </p>
          </div>
        )}

        {/* Comment list */}
        {!isLoading && data && data.comments.length > 0 && (
          <div className="mt-4 divide-y">
            {data.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Comments;
