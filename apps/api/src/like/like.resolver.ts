import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LikeService } from "./like.service.js";
import { Like } from "./entities/like.entity.js";
import { CreateLikeInput } from "./dto/create-like.input.js";
import { UpdateLikeInput } from "./dto/update-like.input.js";

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}
}
