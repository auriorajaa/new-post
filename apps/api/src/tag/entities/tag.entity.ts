import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Post } from "../../post/entities/post.entity.js";

@ObjectType()
export class Tag {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [Post])
  posts: Post[];
}
