import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let mockConfigService: Partial<ConfigService>;
  let mockJwtService: Partial<JwtService>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'mock-secret-key';
        if (key === 'JWT_EXPIRATION') return '300';
        return null;
      }),
    };

    mockJwtService = {
      sign: jest.fn(() => 'mock-token'),
    };

    mockResponse = {
      cookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login a user and set a cookie', async () => {
    const user: User = new User();
    user._id = new Types.ObjectId('507f1f77bcf86cd799439011');
    user.email = 'test@example.com';
    user.password = 'test-password';

    await service.login(user, mockResponse as Response);

    expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('JWT_EXPIRATION');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      _id: user._id.toHexString(),
      email: 'test@example.com',
    });
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'Authentication',
      'mock-token',
      expect.objectContaining({
        httpOnly: true,
        expires: expect.any(Date),
      }),
    );
  });

  it('should logout a user and clear the cookie', () => {
    service.logout(mockResponse as Response);

    expect(mockResponse.cookie).toHaveBeenCalledWith('Authentication', '', {
      httpOnly: true,
      expires: expect.any(Date),
    });
  });
});
