import { Test, TestingModule } from '@nestjs/testing';
import { ForumService } from './forum.service';
import { ForumRepository } from './forum.repository';

const mockForumRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('ForumService', () => {
  let service: ForumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumService,
        {
          provide: ForumRepository,
          useValue: mockForumRepository,
        },
      ],
    }).compile();

    service = module.get<ForumService>(ForumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
