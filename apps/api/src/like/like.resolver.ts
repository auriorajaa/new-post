import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { LikeService } from "./like.service.js";
import { Like } from "./entities/like.entity.js";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard.js";

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likePost(
    @Context() context: any,
    @Args("postId", { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;

    return await this.likeService.likePost({ postId, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unlikePost(
    @Context() context: any,
    @Args("postId", { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;

    return await this.likeService.unlikePost({ postId, userId });
  }

  @Query(() => Int)
  postLikesCount(@Args("postId", { type: () => Int! }) postId: number) {
    return this.likeService.getPostLikesCount(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  userLikedPost(
    @Context() context: any,
    @Args("postId", { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;

    return this.likeService.userLikedPost({ postId, userId });
  }
}
