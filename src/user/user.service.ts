import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    return this.userRepository.create({
      ...createUserInput,
      password: await this.hashPassword(createUserInput.password),
    });
  }

  async findAll() {
    return this.userRepository.find({});
  }

  async findOne(_id: string) {
    return this.userRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    return this.userRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
          password: await this.hashPassword(updateUserInput.password),
        },
      },
    );
  }

  async remove(_id: string) {
    return this.userRepository.findOneAndDelete({ _id });
  }
}
