import { NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import { ISessionUser, UserRoles } from '@src/models/User';

import { IReq, IRes } from '../common/types';

const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';

type TSessionData = ISessionUser & JwtPayload;

async function adminMw(
    req: IReq,
    res: IRes,
    next: NextFunction,
) {
    const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
    
    if (
        typeof sessionData === 'object' &&
        sessionData?.role === UserRoles.Admin
    ) {
        res.locals.sessionUser = sessionData;
        return next();
    } else {
        return res
            .status(HttpStatusCodes.UNAUTHORIZED)
            .json({ error: USER_UNAUTHORIZED_ERR });
    }
}

export default adminMw;