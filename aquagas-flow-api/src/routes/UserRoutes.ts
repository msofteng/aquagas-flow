import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserService from '@src/services/UserService';
import User from '@src/models/User';

import { IReq, IRes } from './common/types';
import check from './common/check';

async function getAll(_: IReq, res: IRes) {
    const users = await UserService.getAll();
    return res.status(HttpStatusCodes.OK).json({ users });
}

async function add(req: IReq, res: IRes) {
    const user = check.isValid(req.body, 'user', User.isUser);
    await UserService.addOne(user);
    return res.status(HttpStatusCodes.CREATED).end();
}

async function update(req: IReq, res: IRes) {
    const user = check.isValid(req.body, 'user', User.isUser);
    await UserService.updateOne(user);
    return res.status(HttpStatusCodes.OK).end();
}

async function delete_(req: IReq, res: IRes) {
    const id = check.isNum(req.params, 'id');
    await UserService.delete(id);
    return res.status(HttpStatusCodes.OK).end();
}

export default {
    getAll,
    add,
    update,
    delete: delete_,
} as const;