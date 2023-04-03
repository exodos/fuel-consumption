import { hash, compare } from "bcryptjs";

const hashPassword = async (password: any) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (password: any, hashedPassword: any) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export { hashPassword, verifyPassword };
