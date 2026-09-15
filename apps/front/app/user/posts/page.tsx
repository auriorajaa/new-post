import Link from "next/link";
import { fetchUserPosts } from "@/lib/actions/postActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { NoteAddIcon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import PostList from "./_components/postList";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const UserPostPage = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const currentPage = page ? Number(page) : 1;

  const { totalPosts, posts } = await fetchUserPosts({
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all the articles you have published.
          </p>
        </div>

        <Button nativeButton={false} render={<Link href="/user/create-post" />}>
          <HugeiconsIcon icon={NoteAddIcon} className="size-4" />
          New post
        </Button>
      </div>

      <div className="mt-8">
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <HugeiconsIcon
              icon={File01Icon}
              className="size-8 text-muted-foreground"
            />
            <div>
              <p className="text-sm font-medium">No posts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start sharing your thoughts with your first article.
              </p>
            </div>
            <Button className="mt-2" render={<Link href="/user/create-post" />}>
              <HugeiconsIcon icon={NoteAddIcon} className="size-4" />
              Create your first post
            </Button>
          </div>
        ) : (
          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={Math.ceil(totalPosts / DEFAULT_PAGE_SIZE)}
          />
        )}
      </div>
    </main>
  );
};

export default UserPostPage;
