import { toObjectId } from './mongo.utils';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('toObjectId', () => {
  it('should convert a valid string to ObjectId', () => {
    const id = new Types.ObjectId().toHexString();
    const result = toObjectId(id);

    expect(result).toBeInstanceOf(Types.ObjectId);
    expect(result.toHexString()).toBe(id);
  });

  it('should throw BadRequestException for invalid ObjectId string', () => {
    expect(() => toObjectId('invalid-id')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for empty string', () => {
    expect(() => toObjectId('')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for null input', () => {
    expect(() => toObjectId(null as unknown as string)).toThrow(
      BadRequestException,
    );
  });
});
