import HttpStatusCodes from '@src/common/HttpStatusCodes';

export class RouteError extends Error {
    public status: HttpStatusCodes;

    public constructor(status: HttpStatusCodes, message: string) {
        super(message);
        this.status = status;
    }
}

export class ValidationErr extends RouteError {
    public static MSG = 'The follow parameter were missing or invalid "';

    public constructor(paramName: string) {
        super(HttpStatusCodes.BAD_REQUEST, ValidationErr.GetMsg(paramName));
    }

    public static GetMsg(param: string) {
        return ValidationErr.MSG + param + '".';
    }
}