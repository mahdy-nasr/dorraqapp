export interface AppConfig {
  googleAuth: GoogleAuthConfig;
  session: sessionConfig;
  databaseURL: string;
  api: ApiConfig;
  docs: SwaggerConfig;
  logs: LogsConfig;
  server: ServerConfig;
}

interface GoogleAuthConfig {
  clientID: string;
  clientSecret: string;
}

interface sessionConfig {
  encryptionKey: string;
  maxAge: number;
}

interface ApiConfig {
  basePath: string;
  version: string;
}

interface SwaggerConfig {
  swaggerUIPath: string;
  apiDocsPath: string;
}

interface LogsConfig {
  dir: string;
  logFile: string;
  errorLogFile: string;
  logDateFormat: string;
}

interface ServerConfig {
  port: number;
  baseUrl: string;
}
