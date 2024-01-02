import { type User } from '@prisma/client';
import { type DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import logger from '../logger';
import UserService from '@/modules/users/users.service';
import { firebase } from '@/lib/firebase';
import { type UserRole } from '@/modules/users/users-types';

export class AuthUser {
  decodedJWT: DecodedIdToken | undefined = undefined;
  user: User | null = null;
  userService = new UserService();

  public async initializeWithJWT(jwt: string) {
    try {
      this.decodedJWT = await firebase.auth().verifyIdToken(jwt);
      this.user = await this.userService.findUserById(this.decodedJWT.uid);
    } catch (_) {
      logger.info('Invalid JWT token Or User not found');
    }
  }


  isAuthorized(role: UserRole): boolean {
    return this.user?.role === role;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  getDecodedJWT(): DecodedIdToken | undefined {
    return this.decodedJWT;
  }

  getUser(): User | null {
    return this.user;
  }
}
