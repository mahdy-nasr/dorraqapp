import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';

interface CreateUserInput {
  firebaseUid: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | undefined;
  phone: string | undefined;
}
export default class UserService {
  public async createUser(userData: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        firebaseUid: userData.firebaseUid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilePicture: userData.profilePicture,
        phone: userData.phone,
      },
    });
    return user;
  }

  public async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public async findUserById(firebaseUid: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    return user;
  }
}
