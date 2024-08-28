import { NextFunction, Router } from 'express';
import { IReq, IRes } from './common/types';

import jetValidator from 'jet-validator';

import Routes from '@src/interfaces/routes';
import IValidate from '@src/interfaces/validate';
import Paths from '@src/common/Paths';
import UserController from '@src/controllers/user';
import adminMw from '@src/routes/middleware/adminMw';

export default class UserRoutes implements Routes {
    path?: string | undefined;
    router: Router;
    validate: IValidate;
    controller: UserController;
    middleware: ((req: IReq, res: IRes, next: NextFunction) => Promise<void | IRes>);

    constructor() {
        this.path = Paths.Users.Base;
        this.router = Router();
        this.validate = jetValidator();
        this.controller = new UserController();
        this.middleware = adminMw;

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}${Paths.Users.Get}`, this.middleware, this.controller.getAll);
        this.router.post(`${this.path}${Paths.Users.Add}`, this.middleware, this.controller.add);
        this.router.put(`${this.path}${Paths.Users.Update}`, this.middleware, this.controller.update);
        this.router.delete(`${this.path}${Paths.Users.Delete}`, this.middleware, this.controller.delete_);
    }
}