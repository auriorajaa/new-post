"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Post } from "@/lib/types/modelTypes";
// import { deletePost } from "@/lib/actions/postActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVerticalIcon,
  PencilEdit02Icon,
  ViewIcon,
  Delete02Icon,
  HeartIcon,
  Comment01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  post: Post & { likesCount?: number; commentsCount?: number };
};

const PostCard = ({ post }: Props) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // const handleDelete = async () => {
  //   setIsDeleting(true);
  //   try {
  //     await deletePost(post.id);
  //     toast.success("Post deleted");
  //     router.refresh();
  //   } catch {
  //     toast.error("Failed to delete post");
  //   } finally {
  //     setIsDeleting(false);
  //     setDeleteOpen(false);
  //   }
  // };

  return (
    <>
      <Card className="overflow-hidden py-0">
        <CardContent className="flex gap-4 p-4 sm:gap-5">
          {/* Thumbnail */}
          <div className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-2-xl bg-muted sm:size-24">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover rounded-2xl"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <HugeiconsIcon
                  icon={Image01Icon}
                  className="size-6 text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}/${post.id}`}
                  className="line-clamp-2 text-sm font-medium hover:underline sm:text-base"
                >
                  {post.title}
                </Link>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      aria-label="Post actions"
                    />
                  }
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    render={<Link href={`/blog/${post.slug}/${post.id}`} />}
                  >
                    <HugeiconsIcon icon={ViewIcon} className="size-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href={`/user/posts/${post.id}/edit`} />}
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={HeartIcon} className="size-3.5" />
                {post._count.likes ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Comment01Icon} className="size-3.5" />
                {post._count.comments ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{post.title}&quot; along with
              its comments and likes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
};

export default PostCard;
