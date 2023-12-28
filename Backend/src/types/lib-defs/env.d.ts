import { type Environments } from '@/lib/environment/environment.enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Environments;
    }
  }
}

export {};
