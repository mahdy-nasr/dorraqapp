import { type Environments } from '@/lib/environment/environment.enum';

export type CommonEnvKeys = keyof typeof Environments;
export type EnvFileKeys = CommonEnvKeys | 'DEFAULT';
