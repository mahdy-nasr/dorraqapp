import { type users } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class UserService {
  public async createUser(name: string, email: string): Promise<users> {
    const user = await prisma.users.create({
      data: {
        name,
        email,
      },
    });
    return user;
  }

  public async findUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  public async findUserById(id: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { id },
      });

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
}
