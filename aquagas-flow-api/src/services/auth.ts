import UserRepository from '@src/repos/user';
import PwdUtil from '@src/util/PwdUtil';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { tick } from '@src/util/misc';
import { RouteError } from '@src/common/classes';
import { IUser } from '@src/models/user';


export const Errors = {
    Unauth: 'Unauthorized',
    EmailNotFound(email: string) {
        return `User with email "${email}" not found`;
    },
} as const;

export default class AuthService {
    repository: UserRepository;

    constructor () {
        this.repository = new UserRepository();
    }

    async login(email: string, password: string): Promise<IUser> {
        const user = await this.repository.getOne(email);
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
}