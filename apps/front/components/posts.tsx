import { Post } from "@/lib/types/modelTypes";
import React from "react";

import PostCard from "@/components/postCard";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  pageSize: number;
};

const Posts = ({ posts, totalPosts, currentPage, pageSize }: Props) => {
  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Discover
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Latest Posts
          </h2>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-16">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/?page=${currentPage - 1}`} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`/?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/?page=${currentPage + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default Posts;
