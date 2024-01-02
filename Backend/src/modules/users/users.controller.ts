import { type Response, type Request } from 'express';
import { type User } from '@prisma/client';
import { HttpStatusCode as Status } from 'axios';
import UserService from './users.service';
import { type CreateUserRequestDto } from './dto/user.dto';
import Api from '@/lib/api';
import { HttpBadRequestError, HttpInternalServerError } from '@/lib/errors';
export default class UserController extends Api {
  private readonly userService = new UserService();

  public finishUserRegistration = async (
    req: Request<unknown, unknown, CreateUserRequestDto>,
    res: Response<User>
  ) => {
    if (req.authUser?.isAuthenticated()) {
      return this.send(res, req.authUser.getUser()!);
    }
    if (!req.authUser?.getDecodedJWT()) {
      throw new HttpBadRequestError('Invalid JWT token');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const decodedJWT = req.authUser?.getDecodedJWT()!;
    try {
      const user = await this.userService.createUser({
        id: decodedJWT.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: decodedJWT.email!,
        profilePicture: decodedJWT.picture,
        phone: decodedJWT.phone_number,
      });
      return this.send(res, user, Status.Created);
    } catch (error) {
      throw new HttpInternalServerError(
        (error as Error)?.message ?? 'Error while creating user'
      );
    }
  };
}
