import { Response } from 'supertest';
import { IUser } from '@src/models/User';

export type TReqBody = Record<string, unknown>;
export type TRes = Omit<Response, 'body'> & { body: TBody };
export type TApiCb = (res: TRes) => void;

type TBody = {
    [key: string]: unknown;
    user?: IUser;
    users?: IUser[];
}