import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let messageService: MessageService;

  const mockMessageService = {
    createMessage: jest.fn(),
    getMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createMessage', () => {
    it('should call messageService.createMessage and return the result', async () => {
      const input: CreateMessageInput = {
        content: 'Test message',
        forumId: 'forum123',
      };
      const user = { _id: 'user456', email: 'test_user@test.com' };

      const expectedMessage: Message = {
        _id: new Types.ObjectId(),
        content: input.content,
        ownerId: user._id,
        createdAt: new Date(),
      };

      mockMessageService.createMessage.mockResolvedValue(expectedMessage);

      const result = await resolver.createMessage(input, user);

      expect(messageService.createMessage).toHaveBeenCalledWith(
        input,
        user._id,
      );
      expect(result).toEqual(expectedMessage);
    });
  });

  describe('getMessages', () => {
    it('should call messageService.getMessages and return the result', async () => {
      const args: GetMessagesArgs = {
        forumId: 'forum123',
      };
      const user = { _id: 'user456', email: 'test_user@test.com' };

      const expectedMessages: Message[] = [
        {
          _id: new Types.ObjectId(),
          content: 'First message',
          ownerId: user._id,
          createdAt: new Date(),
        },
        {
          _id: new Types.ObjectId(),
          content: 'Second message',
          ownerId: user._id,
          createdAt: new Date(),
        },
      ];

      mockMessageService.getMessages.mockResolvedValue(expectedMessages);

      const result = await resolver.getMessages(args, user);

      expect(messageService.getMessages).toHaveBeenCalledWith(args, user._id);
      expect(result).toEqual(expectedMessages);
    });
  });
});
