import { config as configDotenv } from 'dotenv';
import server from './server';
import { printAppInfo } from './utils/print-app-info';
import appConfig from './AppConfig/app.config';
import prisma from '@/lib/prisma';
import environment from '@/lib/environment/environment';

configDotenv();

server.listen(process.env.PORT, () => {
  const { env } = environment;
  const {
    api: { basePath, version },
  } = appConfig;
  const { baseUrl, port } = appConfig.server;
  const appUrl = `${baseUrl}:${port}`;
  const apiUrl = `${appUrl}/${basePath}/${version}`;
  printAppInfo(port, env, appUrl, apiUrl);
});

process.on('SIGINT', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  prisma.$disconnect();
  console.log('Prisma Disconnected.');
  process.exit(0);
});
