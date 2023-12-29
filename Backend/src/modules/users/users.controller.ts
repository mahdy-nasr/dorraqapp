import UserService from './users.service';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();
}
