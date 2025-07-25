import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        Number(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      ...user,
      _id: user._id.toHexString(),
    };

    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires: expires,
    });

    return { token };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyWs(request: Request, connectionParams: any = {}): TokenPayload {
    let jwt = connectionParams.token;

    if (!jwt && request.headers?.cookie) {
      const cookies: string[] = request.headers.cookie?.split('; ') || [];
      const authCookie = cookies?.find((cookie) =>
        cookie.includes('Authentication'),
      );

      if (authCookie) {
        jwt = authCookie.split('Authentication=')[1];
      }
    }

    jwt = jwt?.replace(/^Bearer\s/, '');

    if (!jwt) {
      throw new UnauthorizedException('Missing token');
    }

    return this.jwtService.verify(jwt);
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
