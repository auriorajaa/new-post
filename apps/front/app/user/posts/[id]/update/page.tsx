import Link from "next/link";
import { fetchPostById } from "@/lib/actions/postActions";
import UpdatePostContainer from "./_components/updatePostContainer";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UpdatePostPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await fetchPostById(parseInt(id));

  if (!post) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Post not found
        </h1>
        <p className="text-sm text-muted-foreground">
          The post you are trying to edit does not exist or has been removed.
        </p>
        <Button className="mt-2" render={<Link href="/user/posts" />}>
          Back to your posts
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Update post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write and publish your updated article, or save it as a draft.
        </p>
      </div>

      <UpdatePostContainer post={post} />
    </main>
  );
};

export default UpdatePostPage;
