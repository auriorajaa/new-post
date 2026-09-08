import { Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UserResolver } from "./user.resolver.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
  providers: [UserResolver, UserService, PrismaService],
})
export class UserModule {}
