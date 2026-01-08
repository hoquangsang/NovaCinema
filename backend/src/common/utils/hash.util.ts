import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export const HashUtil = {
  hash: async (text: string, saltRounds = 10) => bcryptHash(text, saltRounds),
  compare: async (text: string, hashed: string) => bcryptCompare(text, hashed),
};
