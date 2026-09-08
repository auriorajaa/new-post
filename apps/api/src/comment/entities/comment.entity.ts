import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Post } from "../../post/entities/post.entity.js";
import { User } from "../../user/entities/user.entity.js";
import type { Circular } from "../../common/types.js";

@ObjectType()
export class CommentEntity {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => Post)
  post: Circular<Post>;

  @Field(() => User)
  author: Circular<User>;

  @Field()
  createdAt: Date;
}
