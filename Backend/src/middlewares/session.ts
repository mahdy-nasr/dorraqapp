import type express from 'express';
import cookieSession from 'cookie-session';
import appConfig from '@/AppConfig/app.config';

export const setupSession = (app: express.Application) => {
  app.use(
    cookieSession({
      maxAge: appConfig.session.maxAge,
      keys: [appConfig.session.encryptionKey],
    })
  );
};
