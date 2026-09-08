import { CreateLikeInput } from './create-like.input.js';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLikeInput extends PartialType(CreateLikeInput) {
  @Field(() => Int)
  id: number;
}
