import jsonwebtoken from 'jsonwebtoken';

import HttpStatusCodes from '@src/common/HttpStatusCodes';

import EnvVars from '@src/common/EnvVars';
import { RouteError } from '@src/common/classes';

import { IReq, IRes } from '@src/routes/common/types';

const Errors = {
    ParamFalsey: 'Param is falsey',
    Validation: 'JSON-web-token validation failed.',
} as const;

const Options = {
    expiresIn: EnvVars.Jwt.Exp,
};

function getSessionData<T>(req: IReq): Promise<string | T | undefined> {
    const { Key } = EnvVars.CookieProps,
        jwt = req.signedCookies[Key];
    return _decode(jwt);
}

function _decode<T>(jwt: string): Promise<string | undefined | T> {
    return new Promise((res, rej) => {
        jsonwebtoken.verify(jwt, EnvVars.Jwt.Secret, (err, decoded) => {
            if (!!err) {
                const err = new RouteError(HttpStatusCodes.UNAUTHORIZED,
                    Errors.Validation);
                return rej(err);
            } else {
                return res(decoded as T);
            }
        });
    });
}

async function addSessionData(
    res: IRes,
    data: string | object,
): Promise<IRes> {
    if (!res || !data) {
        throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.ParamFalsey);
    }

    const jwt = await _sign(data),
        { Key, Options } = EnvVars.CookieProps;

    return res.cookie(Key, jwt, Options);
}

function _sign(data: string | object | Buffer): Promise<string> {
    return new Promise((res, rej) => {
        jsonwebtoken.sign(data, EnvVars.Jwt.Secret, Options, (err, token) => {
            return (err ? rej(err) : res(token ?? ''));
        });
    });
}

function clearCookie(res: IRes): IRes {
    const { Key, Options } = EnvVars.CookieProps;
    return res.clearCookie(Key, Options);
}

export default {
    addSessionData,
    getSessionData,
    clearCookie,
} as const;