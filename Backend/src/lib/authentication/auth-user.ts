import { type User } from '@prisma/client';
import { type DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import UserService from '@/modules/users/users.service';

export class AuthUser {
  jwtUser: DecodedIdToken | undefined = undefined;
  fullUser: User | undefined = undefined;
  userService = new UserService();

  constructor(jwtUser: DecodedIdToken | undefined = undefined) {
    this.jwtUser = jwtUser;
  }

  public setJwtUser(jwtUser: DecodedIdToken) {
    this.jwtUser = jwtUser;
  }

  // in future, we can add parameter (role: string) to check
  // if user is authorized to access a resource (e.g. teacher, student, admin)
  isAuthorized(): boolean {
    return !!this.jwtUser;
  }

  // for now both authenticated and authorized do the same thing
  // But later on, authenticated will check if user is logged in
  // and authorized will check if user is allowed to access a resource
  isAuthenticated(): boolean {
    return !!this.jwtUser;
  }

  async getFullUser(): Promise<User | undefined> {
    if (this.fullUser ?? !this.isAuthorized()) {
      return this.fullUser;
    }

    try {
      const user = await this.userService.findUserById(this.jwtUser?.uid ?? '');
      this.fullUser = user ?? undefined;
      return this.fullUser;
    } catch (_) {
      return this.fullUser;
    }
  }
}
