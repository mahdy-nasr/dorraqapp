import { type Response, type Request } from 'express';
import { type User } from '@prisma/client';
import { HttpStatusCode as Status } from 'axios';
import UserService from './users.service';
import { type CreateUserRequestDto } from './dto/user.dto';
import { type UpdateUserRequestDto } from './dto/user-settings.dto';
import Api from '@/lib/api';
import { HttpBadRequestError, HttpInternalServerError } from '@/lib/errors';
export default class UserController extends Api {
  private readonly userService = new UserService();

  public login = async (req: Request, res: Response<User>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.send(res, req.authUser?.getUser()!);
  };

  public continueUserRegistration = async (
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

  public UpdateUserInfo = async (
    req: Request<unknown, unknown, UpdateUserRequestDto>,
    res: Response
  ) => {
    try {
      // Check if req.file is defined before accessing its filename property
      const imageFilePath: string | undefined = req.file?.filename
        ? encodeURIComponent(req.file.filename)
        : undefined;
      if (!imageFilePath) {
        throw new HttpBadRequestError('No image provided');
      }
      const userId = req.authUser?.getUser()?.id;
      if (!userId) {
        throw new HttpBadRequestError('User ID not found');
      }
      const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        city: req.body.city,
        university: req.body.university,
        education: req.body.education,
        phone: req.body.phone,
        language: req.body.language,
        gender: req.body.gender,
        profilePicture: imageFilePath,
      };
      const updatedUser = await this.userService.updateUser({
        id: userId,
        data,
      });
      return this.send(res, updatedUser, Status.Ok);
    } catch (error) {
      throw new HttpInternalServerError(
        (error as Error)?.message ?? 'Error while updating user information'
      );
    }
  };
}
