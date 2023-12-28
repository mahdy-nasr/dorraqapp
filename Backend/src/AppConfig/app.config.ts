import { type AppConfig } from './app-config.definition';

const appConfig: AppConfig = {
  session: {
    encryptionKey: 'encryption_key',
    maxAge: 60 * 60 * 24 * 1000, // 3 years
  },
  googleAuth: {
    clientID: 'client_id',
    clientSecret: 'client_secret',
  },
  postgresConnString: 'postgres://postgres:postgres@localhost:5432/postgres',
  api: {
    basePath: 'api',
    version: 'v1',
  },
  docs: {
    swaggerUIPath: '/v1/swagger',
    apiDocsPath: '/v1/api-docs',
  },
  logs: {
    dir: './logs',
    logFile: 'app.log',
    errorLogFile: 'error.log',
    logDateFormat: 'DD-MM-YYYY HH:MM:SS',
  },
  server: {
    port: 3000,
    baseUrl: 'http://localhost',
  },
};

export default appConfig;
