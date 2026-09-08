import { Resolver, Query } from "@nestjs/graphql";
import { PostService } from "./post.service.js";
import { Post } from "./entities/post.entity.js";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: "posts" })
  findAll() {
    return this.postService.findAll();
  }
}
