import { NextFunction, Router } from 'express';
import { IReq, IRes } from '@src/routes/common/types';

import IController from '@src/interfaces/controller';
import IValidate from '@src/interfaces/validate';

export default interface Routes {
    path?: string;
    router: Router;
    controller: IController;
    validate?: IValidate;
    middleware?: (req: IReq, res: IRes, next: NextFunction) => Promise<void | IRes>;
}