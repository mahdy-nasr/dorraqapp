import type express from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';
import sessionkeys from '@/AppConfig/SessionConfig/session-keys';

export const setupSession = (app: express.Application) => {
  app.use(
    cookieSession({
      maxAge: 60 * 60 * 24 * 1000,
      keys: [sessionkeys.session.cookieEncryptionKey],
    })
  );
  // initialize passport
  app.use(passport.initialize());
};
