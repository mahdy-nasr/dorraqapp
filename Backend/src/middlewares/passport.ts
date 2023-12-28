import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { type User } from '@prisma/client'; // Make sure to import the User type from Prisma
import type express from 'express';
import UserService from '@/modules/users/users.service';
import appConfig from '@/AppConfig/app.config';

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userService = new UserService();
    const user = await userService.findUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(null, error);
  }
});

export const setupPassport = (app: express.Application) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

export default passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: appConfig.googleAuth.clientID,
      clientSecret: appConfig.googleAuth.clientSecret,
      callbackURL:
        'http://localhost:3000/api/v1/development/users/auth/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log('passport callback function fired:');
      const name: string = profile.displayName;
      const email: string = profile.emails ? profile.emails[0].value : '';
      const profilePicture: string = profile.photos
        ? profile.photos[0].value
        : '';
      console.log(profilePicture);
      const userService = new UserService();
      // chek if user already exists in our DB
      try {
        // Check if the user already exists in the database
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
          // User exists
          console.log('User is already exists');
          done(null, existingUser);
        } else {
          // Save in the database using Prisma or any other ORM
          const newUser = await userService.createUser(
            name,
            email,
            profilePicture
          );
          done(null, newUser);
        }
      } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        done(null, error);
      }
    }
  )
);
