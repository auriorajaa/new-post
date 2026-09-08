import { ObjectType, Field, Int } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity.js";
import { Post } from "../../post/entities/post.entity.js";

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => Post)
  post: Post;

  @Field()
  createdAt: Date;
}
