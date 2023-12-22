import { type Response, type NextFunction, type Request } from 'express';
import UserService from './users.service';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public authLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.send('login');
    } catch (e) {
      next(e);
    }
  };

  public authLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // handle with passport
      req.logout(function (err) {
        if (err) {
          console.log(err);
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
      // res.redirect('/profile');
    } catch (e) {
      next(e);
    }
  };
}
