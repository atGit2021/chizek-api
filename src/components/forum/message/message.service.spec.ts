import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { ForumRepository } from '../forum.repository';

describe('MessageService', () => {
  let service: MessageService;

  const mockForumRepository = {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: ForumRepository,
          useValue: mockForumRepository,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a message and push it to the forum', async () => {
    const mockInput = { content: 'Hello', forumId: '123456789012345678901234' };
    const mockOwnerId = 'owner123';
    const mockMessage = expect.objectContaining({
      content: mockInput.content,
      ownerId: mockOwnerId,
    });

    mockForumRepository.findOneAndUpdate.mockResolvedValue({
      messages: [mockMessage],
    });

    const result = await service.createMessage(mockInput, mockOwnerId);
    expect(result).toEqual(mockMessage);
    expect(mockForumRepository.findOneAndUpdate).toHaveBeenCalled();
  });
});
