import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserService from '@src/services/UserService';
import User from '@src/models/User';
import check from '@src/routes/common/check';
import IController from '@src/interfaces/controller';

import { IReq, IRes } from '@src/routes/common/types';

export default class UserController implements IController {
    getAll = async (_: IReq, res: IRes) => {
        const users = await UserService.getAll();
        return res.status(HttpStatusCodes.OK).json({ users });
    }
    
    add = async (req: IReq, res: IRes) => {
        const user = check.isValid(req.body, 'user', User.isUser);
        await UserService.addOne(user);
        return res.status(HttpStatusCodes.CREATED).end();
    }
    
    update = async (req: IReq, res: IRes) => {
        const user = check.isValid(req.body, 'user', User.isUser);
        await UserService.updateOne(user);
        return res.status(HttpStatusCodes.OK).end();
    }
    
    delete_ = async (req: IReq, res: IRes) => {
        const id = check.isNum(req.params, 'id');
        await UserService.delete(id);
        return res.status(HttpStatusCodes.OK).end();
    }
}