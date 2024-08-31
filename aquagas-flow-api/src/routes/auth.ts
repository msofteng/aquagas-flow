import { Router } from 'express';

import jetValidator from 'jet-validator';

import Routes from '@src/interfaces/routes';
import Paths from '@src/common/Paths';
import AuthController from '@src/controllers/auth';
import IValidate from '@src/interfaces/validate';

export default class AuthRoutes implements Routes {
    path: string;
    router: Router;
    validate: IValidate;
    controller: AuthController;

    constructor() {
        this.path = Paths.Auth.Base;
        this.router = Router();
        this.validate = jetValidator();
        this.controller = new AuthController();

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}${Paths.Auth.Login}`,
            this.validate('email', 'password'),
            this.controller.login
        );

        this.router.get(
            `${this.path}${Paths.Auth.Logout}`,
            this.controller.logout
        );
    }
}

