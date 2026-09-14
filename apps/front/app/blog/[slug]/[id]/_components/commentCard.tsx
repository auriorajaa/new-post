import { CommentEntity } from "@/lib/types/modelTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  comment: CommentEntity;
};

const CommentCard = ({ comment }: Props) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="flex gap-3 py-4 sm:gap-4">
      <Avatar className="size-8 shrink-0 sm:size-9">
        <AvatarImage
          src={comment.author?.avatar ?? undefined}
          alt={comment.author?.name}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback>
          <HugeiconsIcon icon={UserIcon} className="size-4" />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium">{comment.author?.name}</span>
          <time className="text-xs text-muted-foreground">{formattedDate}</time>
        </div>

        <p className="mt-1 text-sm leading-relaxed wrap-break-word text-foreground">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
