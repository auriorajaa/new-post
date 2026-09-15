"use server";

import { print } from "graphql";
import { authFetchGraphQL } from "../fetchGraphQL";
import {
  LIKE_POST_MUTATION,
  POST_LIKES,
  UNLIKE_POST_MUTATION,
} from "../gqlQueries";

export async function getPostLikeData(postId: number) {
  const { data, errors } = await authFetchGraphQL(print(POST_LIKES), {
    postId,
  });

  if (errors) {
    console.error("Failed to fetch like data:", errors);
    return { likeCount: 0, userLikedPost: false };
  }

  return {
    likeCount: data.postLikesCount as number,
    userLikedPost: data.userLikedPost as boolean,
  };
}

export async function likePost(postId: number) {
  const { data, errors } = await authFetchGraphQL(print(LIKE_POST_MUTATION), {
    postId,
  });

  if (errors) {
    console.error("Failed to liking the post:", errors);
    return { likePost: 0 };
  }

  return {
    likePost: data.likePost as number,
  };
}

export async function unLikePost(postId: number) {
  const { data, errors } = await authFetchGraphQL(print(UNLIKE_POST_MUTATION), {
    postId,
  });

  if (errors) {
    console.error("Failed to unlike the post:", errors);
    return { unlikePost: 0 };
  }

  return {
    unlikePost: data.unLikePost as number,
  };
}
