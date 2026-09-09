import { Post } from "@/lib/types/modelTypes";
import React from "react";

import PostCard from "@/components/postCard";

type Props = {
  posts: Post[];
};

const Posts = ({ posts }: Props) => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Posts
            </h2>
          </div>

          {/* <a
            href="/articles"
            className="hidden text-sm font-medium underline-offset-4 hover:underline sm:block"
          >
            View all
          </a> */}
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No posts available yet.
            </p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-10 sm:hidden">
          <a
            href="/articles"
            className="text-sm font-medium underline underline-offset-4"
          >
            View all posts
          </a>
        </div>
      </div>
    </section>
  );
};

export default Posts;
