import bcrypt from "bcryptjs";

export const hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, 10);
};

export const comparePasswords = async (plainText, hashed) => {
  return await bcrypt.compare(plainText, hashed);
};
