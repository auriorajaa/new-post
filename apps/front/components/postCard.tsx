import { Post } from "@/lib/types/modelTypes";
import Link from "next/link";
import Image from "next/image";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";

type Props = Partial<Post>;

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1536566482680-fca31930a0bd?q=80&w=387&auto=format&fit=crop";

const IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

const PostCard = ({
  id,
  title,
  slug,
  thumbnail,
  content,
  createdAt,
}: Props) => {
  const href = slug ? `/blog/${slug}/${id}` : "#";

  return (
    <Card className="group overflow-hidden border-0 bg-transparent py-0">
      {/* Thumbnail */}
      <Link href={href} className="block overflow-hidden rounded-2xl">
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          <Image
            src={thumbnail || FALLBACK_THUMBNAIL}
            alt={title ?? "Article thumbnail"}
            fill
            loading="eager"
            sizes={IMAGE_SIZES}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="py-5">
        {/* Date */}
        {createdAt && (
          <time
            dateTime={new Date(createdAt).toISOString()}
            className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}

        {/* Title */}
        {title && (
          <Link href={href} className="block">
            <h2 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-muted-foreground sm:text-2xl">
              {title}
            </h2>
          </Link>
        )}

        {/* Excerpt */}
        {content && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground sm:text-base">
            {content}
          </p>
        )}

        {/* Read More */}
        <Link
          href={href}
          className="mt-5 inline-flex items-center text-sm font-medium"
        >
          Read article
        </Link>
      </CardContent>
    </Card>
  );
};

export default PostCard;
