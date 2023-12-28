import { str, num } from 'envalid';
import { Environments } from '@/lib/environment/environment.enum';

const envValidationConfig = {
  NODE_ENV: str({
    default: Environments.DEV,
    choices: [...Object.values(Environments)],
  }),
  PORT: num(),
  APP_BASE_URL: str(),
  DATABASE_URL: str(),
  SESSION_ENC_KEY: str(),
  FIREBASE_PROJECT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
};

export default envValidationConfig;
