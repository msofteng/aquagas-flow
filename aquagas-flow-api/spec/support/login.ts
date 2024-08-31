import { Test, Response } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import User, { UserRoles } from '@src/models/User';
import PwdUtil from '@src/util/PwdUtil';
import Paths from '@spec/support/Paths';
import UserRepository from '@src/repos/repo';

const LoginCreds = {
    email: 'jsmith@gmail.com',
    password: 'Password@1',
} as const;

const UserRepo = new UserRepository();

function login(beforeAgent: TestAgent<Test>, done: (arg: string) => void) {
    const role = UserRoles.Admin,
        pwdHash = PwdUtil.hashSync(LoginCreds.password),
        loginUser = User.new('john smith', LoginCreds.email, new Date(), role,
            pwdHash);

    spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);

    beforeAgent
        .post(Paths.Auth.Login)
        .type('form')
        .send(LoginCreds)
        .end((_: Error, res: Response) => {
            const cookie = res.headers['set-cookie'][0];
            return done(cookie);
        });
}

export default login;