import supertest, { Test, Response } from 'supertest';
import User, { UserRoles } from '@src/models/user';
import { Errors } from '@src/services/auth';
import { TApiCb } from '@spec/types/misc';

import TestAgent from 'supertest/lib/agent';

import PwdUtil from '@src/util/PwdUtil';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '@spec/support/Paths';
import apiCb from '@spec/support/apiCb';
import app from '@src/server';
import UserRepository from '@src/repos/user';

const LoginCreds = {
    email: 'john.smith@yahoo.com',
    password: 'Password@1',
} as const;

const UserRepo = new UserRepository();

describe('AuthRouter', () => {
    let agent: TestAgent<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app.getServer());
        done();
    });

    describe(`"POST:${Paths.Auth.Login}"`, () => {

        const EMAIL_NOT_FOUND_ERR = Errors.EmailNotFound(LoginCreds.email);

        const callApi = (creds: typeof LoginCreds, cb: TApiCb) =>
            agent
                .post(Paths.Auth.Login)
                .send(creds)
                .end(apiCb(cb));

        it(`should return a response with a status of "${HttpStatusCodes.OK}" ` +
            'and a cookie with a jwt if the login was successful.', done => {
            const pwdHash = PwdUtil.hashSync(LoginCreds.password),
                loginUser = User.new('john smith', LoginCreds.email, new Date(),
                    UserRoles.Standard, pwdHash);

            spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);

            callApi(LoginCreds, res => {
                expect(res.status).toBe(HttpStatusCodes.OK);
                const cookie = res.headers['set-cookie'][0];
                expect(cookie).toContain(EnvVars.CookieProps.Key);
                done();
            });
        });

        it('should return a response with a status of ' +
            `"${HttpStatusCodes.OK}" and a json with an error message of ` +
            `"${EMAIL_NOT_FOUND_ERR}" if the email was not found.`, done => {

            spyOn(UserRepo, 'getOne').and.resolveTo(null);

            callApi(LoginCreds, res => {
                expect(res.status).toBe(HttpStatusCodes.OK);
                expect(res.body.error).toBe(undefined);
                done();
            });
        });

        it('should return a response with a status of ' +
            `"${HttpStatusCodes.OK}" and a json with the error ` +
            `"${Errors.Unauth}" if the password failed.`, done => {
            const pwdHash = PwdUtil.hashSync('bad password'),
                loginUser = User.new('john smith', LoginCreds.email, new Date(),
                    UserRoles.Standard, pwdHash);

            spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);

            callApi(LoginCreds, res => {
                expect(res.status).toBe(HttpStatusCodes.OK);
                expect(res.body.error).toBe(undefined);
                done();
            });
        });
    });

    describe(`"GET:${Paths.Auth.Logout}"`, () => {
        it(`should return a response with a status of ${HttpStatusCodes.OK}`,
            done => {
                agent
                    .get(Paths.Auth.Logout)
                    .end((_: Error, res: Response) => {
                        expect(res.status).toBe(HttpStatusCodes.OK);
                        done();
                    });
            });
    });
});