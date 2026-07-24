import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { JwtService } from './jwt.service';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    let authAccessToken: string | undefined;

    const cookieHeader = req.headers['cookie'];

    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]*)/);
      if (match) {
        authAccessToken = decodeURIComponent(match[1]);
      }
    }

    if (!authAccessToken) {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authAccessToken = authHeader.slice(7).trim();
      }
    }

    //temp
    if (!authAccessToken) {
      const queryToken = req.query['access_token'];
      if (typeof queryToken === 'string') {
        authAccessToken = queryToken;
      } else if (
        Array.isArray(queryToken) &&
        typeof queryToken[0] === 'string'
      ) {
        authAccessToken = queryToken[0];
      }
    }

    if (!authAccessToken) {
      throw new UnauthorizedException('accessToken token missing');
    }

    const payload = await this.jwtService.verify(authAccessToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (req as any).user = payload;

    return true;
  }
}
