import { Response, Request } from 'express';
import { ISessionUser } from '@src/models/User';

type TObj = Record<string, unknown>;

export interface IReq extends Request<TObj, void, TObj, TObj> {
    signedCookies: Record<string, string>;
}


interface ILocals {
    sessionUser: ISessionUser;
}

export type IRes = Response<unknown, ILocals>;