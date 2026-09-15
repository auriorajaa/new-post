"use server";

import { print } from "graphql";

import { authFetchGraphQL, fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_BY_ID, GET_POSTS, GET_USER_POSTS } from "../gqlQueries";
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

export async function fetchUserPosts({
  page,
  pageSize,
}: {
  page?: number;
  pageSize: number;
}) {
  const { take, skip } = transformTakeSkip({ page, pageSize });

  const {data, errors} = await authFetchGraphQL(print(GET_USER_POSTS), {
    take,
    skip,
  });

  if (errors) {
    console.error("Failed to fetch user post:", errors)
    return { posts: [], totalPosts: 0};
  }

  return {
    posts: data.getUserPosts as Post[],
    totalPosts: data.userPostCount as number,
  }
}
