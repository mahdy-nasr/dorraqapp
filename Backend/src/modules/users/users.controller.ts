import { type Response, type NextFunction, type Request } from 'express';
import UserService from './users.service';
import Api from '@/lib/api';
import { firebase } from '@/lib/firebase';
export default class UserController extends Api {
  private readonly userService = new UserService();

  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check if the user already exists in the database
      const idToken = req.header('idToken') ?? ''; // Assuming the frontend sends the Firebase JWT as 'idToken'
      // Verify the Firebase JWT
      const decodedToken = await firebase.auth().verifyIdToken(idToken);
      // Ensure that the expected properties exist in decodedToken
      if (
        !decodedToken ||
        typeof decodedToken !== 'object' ||
        !decodedToken.email ||
        !decodedToken.picture
      ) {
        throw new Error(
          'Invalid or incomplete user information in the Firebase JWT.'
        );
      }
      // Extract user details from the JWT and the form
      const { email, picture } = decodedToken;
      const { name } = req.body;
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        // User exists
        console.log('User is already exists');
        res.json('User is already exists');
      } else {
        // Save the new user record in the database
        const user = await this.userService.createUser(name, email, picture);
        console.log('User registered:', user);
        // send a success response
        res.status(200).json({ message: 'User registered successfully', user });
      }
    } catch (e) {
      next(e);
    }
  };

  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check if the user already exists in the database
      const idToken = req.body.idToken; // Assuming the frontend sends the Firebase JWT as 'idToken'
      // Verify the Firebase JWT
      const decodedToken = await firebase.auth().verifyIdToken(idToken);
      // Ensure that the expected properties exist in decodedToken
      if (
        !decodedToken ||
        typeof decodedToken !== 'object' ||
        !decodedToken.email
      ) {
        throw new Error(
          'Invalid or incomplete user information in the Firebase JWT.'
        );
      }
      // Extract user details from the JWT and the form
      const { email } = decodedToken;
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        // User exists
        console.log('User is logedIn');
        res.status(200).json({
          message: 'User logged in successfully',
          jwt: idToken,
          user: existingUser,
        });
      } else {
        res.status(401).json('The user is not logged in');
      }
    } catch (e) {
      next(e);
    }
  };
}
