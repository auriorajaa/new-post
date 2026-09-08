import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthResolver } from './auth.resolver.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  providers: [AuthResolver, AuthService, PrismaService],
})
export class AuthModule {}
