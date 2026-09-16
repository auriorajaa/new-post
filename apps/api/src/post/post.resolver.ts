import { Resolver, Query, Context, Args, Int, Mutation } from "@nestjs/graphql";
import { PostService } from "./post.service.js";
import { Post } from "./entities/post.entity.js";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard.js";
import { DEFAULT_PAGE_SIZE } from "../constants.js";
import { CreatePostInput } from "./dto/create-post.input.js";
import { UpdatePostInput } from "./dto/update-post.input.js";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: "posts" })
  findAll(
    @Context() context: any,
    @Args("skip", { nullable: true }) skip?: number,
    @Args("take", { nullable: true }) take?: number,
  ) {
    const user = context.req.user;
    // console.log({ user });
    return this.postService.findAll({ skip, take });
  }

  @Query(() => Int, { name: "postCount" })
  count() {
    return this.postService.count();
  }

  @Query(() => Post)
  getPostById(@Args("id", { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  getUserPosts(
    @Context() context: any,
    @Args("skip", { nullable: true, type: () => Int }) skip?: number,
    @Args("take", { nullable: true, type: () => Int }) take?: number,
  ) {
    const userId = context.req.user.id;

    return this.postService.findByUser({
      userId,
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  userPostCount(@Context() context: any) {
    const userId = context.req.user.id;

    return this.postService.userPostCount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Context() context: any,
    @Args("createPostInput") createPostInput: CreatePostInput,
  ) {
    const authorId = context.req.user.id;

    return this.postService.create({ createPostInput, authorId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Context() context: any,
    @Args("updatePostInput") updatePostInput: UpdatePostInput,
  ) {
    const userId = context.req.user.id;

    return this.postService.update({ userId, updatePostInput });
  }
}
