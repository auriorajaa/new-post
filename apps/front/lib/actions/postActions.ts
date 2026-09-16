"use server";

import { print } from "graphql";

import { authFetchGraphQL, fetchGraphQL } from "../fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
} from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { PostFormState } from "../types/formState";
import { PostFormSchema } from "../zodSchemas/postFormSchema";
import { uploadThumbnail } from "../upload";

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

  const { data, errors } = await authFetchGraphQL(print(GET_USER_POSTS), {
    take,
    skip,
  });

  if (errors) {
    console.error("Failed to fetch user post:", errors);
    return { posts: [], totalPosts: 0 };
  }

  return {
    posts: data.getUserPosts as Post[],
    totalPosts: data.userPostCount as number,
  };
}

export async function saveNewPost(
  state: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };

  let thumbnailUrl = "";

  // Uplaod thumbnail to supabase
  if (validatedFields.data.thumbnail)
    thumbnailUrl = await uploadThumbnail(validatedFields.data.thumbnail);

  // TODO: Call graphql api

  const data = await authFetchGraphQL(print(CREATE_POST_MUTATION), {
    input: {
      ...validatedFields.data,
      thumbnail: thumbnailUrl,
    },
  });

  if (data) return { message: "Success. Your post is saved", ok: true };

  return {
    message: "Something went wrong",
    data: Object.fromEntries(formData.entries()),
  };
}
