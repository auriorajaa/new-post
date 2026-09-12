"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_COMMENTS } from "../gqlQueries";
import { CommentEntity } from "../types/modelTypes";

export async function getPostComments({
  postId,
  skip,
  take,
}: {
  postId: number;
  skip: number;
  take: number;
}) {
  const { data, errors } = await fetchGraphQL(print(GET_POST_COMMENTS), {
    postId,
    take,
    skip,
  });

  if (errors) {
    console.error("Failed to fetch comments:", errors);
    return { comments: [], count: 0 };
  }

  return {
    comments: data.getPostComments as CommentEntity[],
    count: data.postCommentCount as number,
  };
}
