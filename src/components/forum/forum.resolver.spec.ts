import { Test, TestingModule } from '@nestjs/testing';
import { ForumResolver } from './forum.resolver';
import { ForumService } from './forum.service';
import { ForumRepository } from './forum.repository';

const mockForumRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('ForumResolver', () => {
  let resolver: ForumResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumResolver,
        ForumService,
        {
          provide: ForumRepository,
          useValue: mockForumRepository,
        },
      ],
    }).compile();

    resolver = module.get<ForumResolver>(ForumResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
