import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserRepository from '@src/repos/user';

import { RouteError } from '@src/common/classes';
import { IUser } from '@src/models/user';

export const USER_NOT_FOUND_ERR = 'User not found';

export default class UserService {
    repository: UserRepository;

    constructor () {
        this.repository = new UserRepository();
    }

    getAll(): Promise<IUser[]> {
        return this.repository.getAll();
    }

    addOne(user: IUser): Promise<void> {
        return this.repository.add(user);
    }

    async updateOne(user: IUser): Promise<void> {
        const persists = await this.repository.persists(user.id);
        if (!persists) {
            throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
        }
        return this.repository.update(user);
    }

    async _delete(id: number): Promise<void> {
        const persists = await this.repository.persists(id);
        if (!persists) {
            throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
        }
        return this.repository.delete_(id);
    }
}