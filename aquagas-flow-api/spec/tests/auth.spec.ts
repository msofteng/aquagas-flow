import supertest, { Test, Response } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';

import UserRepo from '@src/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';
import User, { UserRoles } from '@src/models/User';
import { Errors } from '@src/services/AuthService';

import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import Paths from 'spec/support/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';

const LoginCreds = {
    email: 'jsmith@gmail.com',
    password: 'Password@1',
} as const;

describe('AuthRouter', () => {

    let agent: TestAgent<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
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
            `"${HttpStatusCodes.UNAUTHORIZED}" and a json with an error message of ` +
            `"${EMAIL_NOT_FOUND_ERR}" if the email was not found.`, done => {

                spyOn(UserRepo, 'getOne').and.resolveTo(null);

                callApi(LoginCreds, res => {
                    expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                    expect(res.body.error).toBe(EMAIL_NOT_FOUND_ERR);
                    done();
                });
            });

        it('should return a response with a status of ' +
            `"${HttpStatusCodes.UNAUTHORIZED}" and a json with the error ` +
            `"${Errors.Unauth}" if the password failed.`, done => {
                const pwdHash = PwdUtil.hashSync('bad password'),
                    loginUser = User.new('john smith', LoginCreds.email, new Date(),
                        UserRoles.Standard, pwdHash);

                spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);

                callApi(LoginCreds, res => {
                    expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                    expect(res.body.error).toBe(Errors.Unauth);
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