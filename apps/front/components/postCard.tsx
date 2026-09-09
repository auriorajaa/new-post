import { Post } from "@/lib/types/modelTypes";
import Link from "next/link";
import Image from "next/image";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";

type Props = Partial<Post>;

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
        <div className="aspect-16/10 relative overflow-hidden bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title ?? "Article thumbnail"}
              fill
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1536566482680-fca31930a0bd?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Article thumbnail"
              fill
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
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
            <h2 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-muted-foreground sm:text-2xl line-clamp-2">
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
