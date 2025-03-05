import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const createUserInput: CreateUserInput = {
      email: 'test@example.com',
      password: 'StrongP@ssword123',
    };
    const hashedPassword = 'hashedPassword123';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
    jest.spyOn(userRepository, 'create').mockResolvedValue({
      _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
      email: createUserInput.email,
      password: hashedPassword,
    });

    const result = await userService.create(createUserInput);

    expect(result).toEqual({
      _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
      email: createUserInput.email,
      password: hashedPassword,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserInput.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...createUserInput,
      password: hashedPassword,
    });
  });

  it('should throw UnprocessableEntityException if email already exists', async () => {
    const createUserInput: CreateUserInput = {
      email: 'test@example.com',
      password: 'StrongP@ssword123',
    };
  
    jest.spyOn(userRepository, 'create').mockRejectedValue(
      new Error('E11000 duplicate key error collection'),
    );

    await expect(userService.create(createUserInput)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
});
