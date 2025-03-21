import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserModule } from './user.module';
import { MockDatabaseModule } from 'src/common/database/mock-database.module';
import { disconnect } from 'mongoose';

describe('UserResolver', () => {
  let module: TestingModule;
  let resolver: UserResolver;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule, MockDatabaseModule],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
    await disconnect();
  });
});
