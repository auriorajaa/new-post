import Hero from "@/components/hero";
import Posts from "@/components/posts";
import { fetchPosts } from "@/lib/actions/postActions";

type Props = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;

  const currentPage = page ? Number(page) : 1;

  const { posts, totalPosts, pageSize } = await fetchPosts({
    page: currentPage,
  });

  return (
    <main>
      <Hero />

      <Posts
        posts={posts}
        totalPosts={totalPosts}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </main>
  );
}
