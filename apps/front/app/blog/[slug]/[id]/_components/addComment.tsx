"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import SubmitButton from "@/components/submitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { saveComment } from "@/lib/actions/commentActions";
import { SessionUser } from "@/lib/session";
import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  postId: number;
  user: SessionUser;
  refetch: () => void;
};

const AddComment = ({ postId, user, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(saveComment, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Comment posted");
      refetch();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [state, refetch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        Leave a comment
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a comment</DialogTitle>
          <DialogDescription>
            Share your thoughts on this article.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />

          <div className="flex items-center gap-2.5 rounded-md border bg-muted/50 px-3 py-2">
            <Avatar className="size-6">
              <AvatarImage
                src={user.avatar ?? undefined}
                alt={user.name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                <HugeiconsIcon icon={UserIcon} className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Commenting as{" "}
              <span className="font-medium text-foreground">{user.name}</span>
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your comment</Label>
            <Textarea
              id="comment"
              name="content"
              placeholder="Share your thoughts..."
              rows={4}
            />
            {!!state?.errors?.content && (
              <p className="text-sm text-destructive">{state.errors.content}</p>
            )}
          </div>

          <DialogFooter>
            <SubmitButton className="w-full sm:w-auto">
              Post comment
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComment;
