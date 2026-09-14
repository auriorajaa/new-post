import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service.js";
import { CommentResolver } from "./comment.resolver.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  providers: [CommentResolver, CommentService, PrismaService],
})
export class CommentModule {}
