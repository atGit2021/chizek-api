import { User } from '../user/entities/user.entity';

export type TokenPayload = Omit<User, '_id'> & { _id: string };
