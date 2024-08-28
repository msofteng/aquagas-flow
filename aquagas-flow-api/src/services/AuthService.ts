import UserRepo from '@src/repos/UserRepo';

import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';

import { IUser } from '@src/models/User';

export const Errors = {
    Unauth: 'Unauthorized',
    EmailNotFound(email: string) {
        return `User with email "${email}" not found`;
    },
} as const;

async function login(email: string, password: string): Promise<IUser> {
    const user = await UserRepo.getOne(email);
    if (!user) {
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED,
            Errors.EmailNotFound(email),
        );
    }
    
    const hash = (user.pwdHash ?? ''),
        pwdPassed = await PwdUtil.compare(password, hash);
    if (!pwdPassed) {
        await tick(500);
        throw new RouteError(
            HttpStatusCodes.UNAUTHORIZED, 
            Errors.Unauth,
        );
    }
    
    return user;
}

export default {
    login,
} as const;