import HttpStatusCodes from '@src/common/HttpStatusCodes';
import IController from '@src/interfaces/controller';
import check from '@src/routes/common/check';
import AuthService from '@src/services/AuthService';
import SessionUtil from '@src/util/SessionUtil';

import { IReq, IRes } from '@src/routes/common/types';

export default class AuthController implements IController {
    login = async (req: IReq, res: IRes) => {
        const [ email, password ] = check.isStr(req.body, ['email', 'password']),
            user = await AuthService.login(email, password);
        
        await SessionUtil.addSessionData(res, {
            id: user.id,
            email: user.name,
            name: user.name,
            role: user.role,
        });
        
        return res.status(HttpStatusCodes.OK).end();
    };
    
    logout = (_: IReq, res: IRes) => {
        SessionUtil.clearCookie(res);
        return res.status(HttpStatusCodes.OK).end();
    };
}