import { NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ISessionUser, UserRoles } from '@src/models/user';
import { IReq, IRes } from '../common/types';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';

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