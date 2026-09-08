import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UserService } from "./user.service.js";
import { User } from "./entities/user.entity.js";
import { CreateUserInput } from "./dto/create-user.input.js";
import { UpdateUserInput } from "./dto/update-user.input.js";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }
}
