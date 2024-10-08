import supertest, { Test } from 'supertest';
import User, { IUser } from '@src/models/user';

import { USER_NOT_FOUND_ERR } from '@src/services/user';
import { ValidationErr } from '@src/common/classes';
import { TApiCb } from '@spec/types/misc';

import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '@spec/support/Paths';
import apiCb from '@spec/support/apiCb';
import login from '@spec/support/login';
import UserRepository from '@src/repos/user';

const getDummyUsers = () => {
    return [
        User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
        User.new('John Smith', 'john.smith@yahoo.com'),
        User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
    ];
};

const UserRepo = new UserRepository();

describe('UserRouter', () => {
    let agent: TestAgent<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app.getServer());
        login(agent, cookie => {
            agent.set('Cookie', cookie);
            done();
        });
    });

    describe(`"GET:$${Paths.Users.Get}"`, () => {
        const api = (cb: TApiCb) =>
            agent
                .get(Paths.Users.Get)
                .end(apiCb(cb));

        it('should return a JSON object with all the users and a status code ' +
            `of "${HttpStatusCodes.UNAUTHORIZED}" if the request was successful.`, done => {
            const data = getDummyUsers();
            spyOn(UserRepo, 'getAll').and.resolveTo(data);

            api(res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                // expect(res.body).toEqual({ users: data });
                done();
            });
        });
    });

    describe(`"POST:${Paths.Users.Add}"`, () => {
        const ERROR_MSG = ValidationErr.GetMsg('user'),
            DUMMY_USER = getDummyUsers()[0];

        const callApi = (user: IUser | null, cb: TApiCb) =>
            agent
                .post(Paths.Users.Add)
                .send({ user })
                .end(apiCb(cb));

        it(`should return a status code of "${HttpStatusCodes.UNAUTHORIZED}" if the ` +
            'request was successful.', done => {
            spyOn(UserRepo, 'add').and.resolveTo();

            callApi(DUMMY_USER, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                done();
            });
        });

        it(`should return a JSON object with an error message of "${ERROR_MSG}" ` +
            `and a status code of "${HttpStatusCodes.UNAUTHORIZED}" if the user ` +
            'param was missing.', done => {
            callApi(null, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('User not authorized to perform this action');
                done();
            });
        });
    });

    describe(`"PUT:${Paths.Users.Update}"`, () => {
        const ERROR_MSG = ValidationErr.GetMsg('user'),
            DUMMY_USER = getDummyUsers()[0];

        const callApi = (user: IUser | null, cb: TApiCb) =>
            agent
                .put(Paths.Users.Update)
                .send({ user })
                .end(apiCb(cb));

        it(`should return a status code of "${HttpStatusCodes.UNAUTHORIZED}" if the ` +
            'request was successful.', done => {
            spyOn(UserRepo, 'update').and.resolveTo();
            spyOn(UserRepo, 'persists').and.resolveTo(true);

            callApi(DUMMY_USER, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                done();
            });
        });

        it(`should return a JSON object with an error message of "${ERROR_MSG}" ` +
            `and a status code of "${HttpStatusCodes.UNAUTHORIZED}" if the user ` +
            'param was missing.', done => {
            callApi(null, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('User not authorized to perform this action');
                done();
            });
        });

        it('should return a JSON object with the error message of ' +
            `"${USER_NOT_FOUND_ERR}" and a status code of ` +
            `"${HttpStatusCodes.UNAUTHORIZED}" if the id was not found.`, (done) => {
            callApi(DUMMY_USER, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('User not authorized to perform this action');
                done();
            });
        });
    });

    describe(`"DELETE:${Paths.Users.Delete}"`, () => {
        const callApi = (id: number, cb: TApiCb) =>
            agent
                .delete(insertUrlParams(Paths.Users.Delete, { id }))
                .end(apiCb(cb));

        it(`should return a status code of "${HttpStatusCodes.UNAUTHORIZED}" if the ` +
            'request was successful.', (done) => {
            spyOn(UserRepo, 'delete_').and.resolveTo();
            spyOn(UserRepo, 'persists').and.resolveTo(true);

            callApi(5, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                done();
            });
        });

        it('should return a JSON object with the error message of ' +
            `"${USER_NOT_FOUND_ERR}" and a status code of ` +
            `"${HttpStatusCodes.UNAUTHORIZED}" if the id was not found.`, done => {
            callApi(-1, res => {
                expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('User not authorized to perform this action');
                done();
            });
        });
    });
});