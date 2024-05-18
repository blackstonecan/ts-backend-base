import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}

const generateRandomString = (length: number): string => {
  return crypto.randomBytes(length).toString("hex");
}

export {
  hashPassword,
  verifyPassword,
  generateRandomString
}