import { type Response, type NextFunction, type Request } from 'express';
import UserService from './users.service';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public authLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // handle with passport
      req.logout(function (err) {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
      });
    } catch (e) {
      next(e);
    }
  };

  public authRedirectGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // handle with passport
      res.send(req.user);
    } catch (e) {
      next(e);
    }
  };
}
