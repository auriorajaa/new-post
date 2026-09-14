import { fetchPostById } from "@/lib/actions/postActions";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Comments from "./_components/comments";
import { getSession } from "@/lib/session";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const PostPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await fetchPostById(Number(id));
  const session = await getSession();

  if (!post) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Post not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The article you are looking for does not exist.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
      <article className="mx-auto w-full max-w-6xl">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to articles
        </Link>

        {/* Article Header */}
        <header className="mt-8 sm:mt-10">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {(post.author?.name || formattedDate) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {post.author?.name && (
                <span className="font-medium text-foreground">
                  {post.author.name}
                </span>
              )}

              {post.author?.name && formattedDate && (
                <span aria-hidden="true">·</span>
              )}

              {formattedDate && <time>{formattedDate}</time>}
            </div>
          )}
        </header>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl sm:mt-10">
            <Image
              src={post.thumbnail}
              alt={post.title ?? "Article thumbnail"}
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          className="mt-8 text-base leading-8 whitespace-pre-line text-foreground sm:mt-10 sm:text-lg sm:leading-9"
        />

        {/* Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <Separator />

            <div className="pt-6">
              <p className="mb-3 text-sm font-medium">Tags</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      <Comments user={session?.user} postId={post.id} />
    </main>
  );
};

export default PostPage;
