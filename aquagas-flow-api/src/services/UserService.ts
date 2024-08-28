import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';

export const USER_NOT_FOUND_ERR = 'User not found';

function getAll(): Promise<IUser[]> {
    return UserRepo.getAll();
}

function addOne(user: IUser): Promise<void> {
    return UserRepo.add(user);
}

async function updateOne(user: IUser): Promise<void> {
    const persists = await UserRepo.persists(user.id);
    if (!persists) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return UserRepo.update(user);
}

async function _delete(id: number): Promise<void> {
    const persists = await UserRepo.persists(id);
    if (!persists) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return UserRepo.delete(id);
}

export default {
    getAll,
    addOne,
    updateOne,
    delete: _delete,
} as const;