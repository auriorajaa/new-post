import { Resolver, Query, Context } from "@nestjs/graphql";
import { PostService } from "./post.service.js";
import { Post } from "./entities/post.entity.js";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard.js";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: "posts" })
  findAll(@Context() context: any) {
    const user = context.req.user;
    console.log({ user });
    return this.postService.findAll();
  }
}
