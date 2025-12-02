import { hash, compare} from "bcrypt";

export const HashUtil = {
  hash: async (text: string) => hash(text, 10),
  compare: async (text: string, hash: string) => compare(text, hash),
};
