import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './user.constants';
import { User } from './entities/user.entity';
import { UserDocument } from './entities/user.document';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    try {
      return this.toEntity(
        await this.userRepository.create({
          ...createUserInput,
          password: await this.hashPassword(createUserInput.password),
        }),
      );
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    const userDocuments = await this.userRepository.find({});
    return Promise.all(
      userDocuments.map((userDocument) => this.toEntity(userDocument)),
    );
  }

  async findOne(_id: string) {
    return this.toEntity(await this.userRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }
    return this.toEntity(
      await this.userRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserInput,
          },
        },
      ),
    );
  }

  async remove(_id: string) {
    return this.toEntity(await this.userRepository.findOneAndDelete({ _id }));
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toEntity(user);
  }

  async uploadProfileImage(file: Buffer, userId: string) {
    await this.s3Service.uploadFile({
      bucket: USERS_BUCKET,
      key: this.getUserImageUrl(userId),
      file,
    });
  }

  async toEntity(userDocument: UserDocument): Promise<User> {
    const user = {
      ...userDocument,
      imageUrl: await this.s3Service.getFileUrl(
        USERS_BUCKET,
        this.getUserImageUrl(userDocument._id.toHexString()),
      ),
    };
    delete user.password;
    return user;
  }

  private getUserImageUrl(userId: string) {
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`;
  }
}
