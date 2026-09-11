"use server";

import { print } from "graphql";

import { fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_BY_ID, GET_POSTS } from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";

export const fetchPosts = async ({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const { skip, take } = transformTakeSkip({
    page,
    pageSize,
  });

  const { data, errors } = await fetchGraphQL(print(GET_POSTS), {
    skip,
    take,
  });

  if (errors) {
    console.error("Failed to fetch posts:", errors);
    return { posts: [], totalPosts: 0, pageSize: take };
  }

  return {
    posts: data.posts as Post[],
    totalPosts: data.postCount,
    pageSize: take,
  };
};

export const fetchPostById = async (id: number) => {
  const { data, errors } = await fetchGraphQL(print(GET_POST_BY_ID), { id });

  if (errors) {
    console.error("Failed to fetch post:", errors);
    return null;
  }

  return data.getPostById as Post;
};
