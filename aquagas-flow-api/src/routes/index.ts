import { Router } from 'express';

import Paths from '@src/common/Paths';

import adminMw from './middleware/adminMw';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

const apiRouter = Router();
const authRouter = Router();

authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.get(Paths.Auth.Logout, AuthRoutes.logout);

apiRouter.use(Paths.Auth.Base, authRouter);

const userRouter = Router();

userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

apiRouter.use(Paths.Users.Base, adminMw, userRouter);

export default apiRouter;