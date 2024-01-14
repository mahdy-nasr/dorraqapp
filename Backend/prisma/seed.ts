import { PrismaClient, type User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import logger from '../src/lib/logger';
import { HR } from '../src/utils/helper';

const prisma = new PrismaClient();
const seedUsers = async (): Promise<void> => {
  const fakeUsers = faker.helpers.uniqueArray<User>(
    () => ({
      id: faker.datatype.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: null,
      profilePicture: null,
      country: null,
      city: null,
      university: null,
      education: null,
      language: 'arabic',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      enabled: true,
      gender: null,
      role: 'student',
      firebaseUid: faker.datatype.uuid(),
    }),
    3
  );

  const users = await prisma.user.createMany({ data: fakeUsers });
  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: user
    \rcount: ${users.count}
    \r${HR('white', '-', 30)}
  `);
};

async function seed(): Promise<void> {
  await Promise.all([seedUsers()]);
}

async function main(): Promise<void> {
  let isError: boolean = false;
  try {
    await seed();
  } catch (e) {
    isError = true;
    logger.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(isError ? 1 : 0);
  }
}

void main();
