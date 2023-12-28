import { Router } from 'express';

import users from './users/users.route';

const router: Router = Router();

router.use('/users', users);

export default router;
