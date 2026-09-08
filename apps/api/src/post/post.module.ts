import { Module } from "@nestjs/common";
import { PostService } from "./post.service.js";
import { PostResolver } from "./post.resolver.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
  providers: [PostResolver, PostService, PrismaService],
})
export class PostModule {}
