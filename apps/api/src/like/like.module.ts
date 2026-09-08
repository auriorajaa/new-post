import { Module } from '@nestjs/common';
import { LikeService } from './like.service.js';
import { LikeResolver } from './like.resolver.js';

@Module({
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
