import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentResolver } from './comment.resolver.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  providers: [CommentResolver, CommentService, PrismaService],
})
export class CommentModule {}
