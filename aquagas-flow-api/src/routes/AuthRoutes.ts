import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';
import check from './common/check';

import { IReq, IRes } from './common/types';

async function login(req: IReq, res: IRes) {
    const [ email, password ] = check.isStr(req.body, ['email', 'password']),
        user = await AuthService.login(email, password);
    
    await SessionUtil.addSessionData(res, {
        id: user.id,
        email: user.name,
        name: user.name,
        role: user.role,
    });
    
    return res.status(HttpStatusCodes.OK).end();
}

function logout(_: IReq, res: IRes) {
    SessionUtil.clearCookie(res);
    return res.status(HttpStatusCodes.OK).end();
}

export default {
    login,
    logout,
} as const;