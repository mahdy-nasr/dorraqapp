import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as configDotenv } from 'dotenv';
import { cleanEnv } from 'envalid';
import {
  EnvironmentFile,
  Environments,
} from '@/lib/environment/environment.enum';
import envValidationConfig from '@/lib/environment/env-config.def';
import { envFileNotFoundError } from '@/utils/helper';
import { type CommonEnvKeys } from '@/lib/environment/environment.type';
import appConfig from '@/AppConfig/app.config';
import { getKeyByEnumValue } from '@/utils/enum-helpers';

export interface IEnvironment {
  getCurrentEnvironment: () => string;
  setEnvironment: (env?: Environments) => void;
  isProd: () => boolean;
  isDev: () => boolean;
  isTest: () => boolean;
  isStage: () => boolean;
}

class Environment implements IEnvironment {
  private _env: Environments = Environments.DEV;

  constructor() {
    this.setEnvironment(process.env.NODE_ENV ?? Environments.DEV);
  }

  get env() {
    return this._env;
  }

  set env(value) {
    this._env = value;
  }

  private resolveEnvPath(key: CommonEnvKeys): string {
    // On priority bar, .env.[NODE_ENV] has higher priority than default env file (.env)
    // If both are not resolved, error is thrown.
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFile);
    const rootDir: string = path.resolve(currentDir, '../../../');
    const envPath = path.resolve(rootDir, EnvironmentFile[key]);
    const defaultEnvPath = path.resolve(rootDir, EnvironmentFile.DEFAULT);
    if (!fs.existsSync(envPath) && !fs.existsSync(defaultEnvPath)) {
      throw new Error(envFileNotFoundError(key));
    }
    return fs.existsSync(envPath) ? envPath : defaultEnvPath;
  }

  private populateAppConfig() {
    const env = cleanEnv(process.env, envValidationConfig);
    appConfig.session.encryptionKey = env.SESSION_ENC_KEY;
    appConfig.firebaseProjectID = env.FIREBASE_PROJECT_ID;
    appConfig.databaseURL = env.DATABASE_URL;
    appConfig.server.baseUrl = env.APP_BASE_URL;
    appConfig.server.port = env.PORT;
  }

  public setEnvironment(env = Environments.DEV): void {
    this.env = env;

    const envKey = getKeyByEnumValue(Environments, env)!;
    const envPath = this.resolveEnvPath(envKey);
    configDotenv({ path: envPath });
    this.populateAppConfig();
  }

  public getCurrentEnvironment() {
    return this.env;
  }

  public isProd() {
    return this.env === Environments.PRODUCTION;
  }

  public isDev() {
    return this.env === Environments.DEV;
  }

  public isStage() {
    return this.env === Environments.STAGING;
  }

  public isTest() {
    return this.env === Environments.TEST;
  }
}

export { Environment };
export default new Environment();
