import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service.js";
import { SignInInput } from "./dto/signin.input.js";
import { AuthPayload } from "./entities/auth-payload.entity.js";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(@Args("signInInput") signInInput: SignInInput) {
    const user = await this.authService.validateLocalUser(signInInput);

    return await this.authService.login(user);
  }
}
