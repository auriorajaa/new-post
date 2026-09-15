import { Module } from "@nestjs/common";
import { LikeService } from "./like.service.js";
import { LikeResolver } from "./like.resolver.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  providers: [LikeResolver, LikeService, PrismaService],
})
export class LikeModule {}
