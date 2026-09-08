import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.post.findMany();
  }
}
