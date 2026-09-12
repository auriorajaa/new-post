import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { GoogleAuthGuard } from "./guards/google-auth/google-auth.guard.js";
import { AuthService } from "./auth.service.js";
import type { Request, Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException("Google authentication failed");
    }

    const userData = await this.authService.login(req.user as any);
    const FRONTEND_URL = process.env.FRONTEND_URL;

    res.redirect(
      `${FRONTEND_URL}/api/auth/google/callback?userId=${userData.id}&name=${userData.name}&avatar=${userData.avatar}&accessToken=${userData.accessToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("verify-token")
  verify() {
    return "ok";
  }
}
