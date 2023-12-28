import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class UserService {
  public async createUser(
    name: string,
    email: string,
    profilePicture: string
  ): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        profilePicture,
      },
    });
    console.log('user1');
    return user;
  }

  public async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
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
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
}
