import { ValidationErr } from '@src/common/classes';

type TReqObj = Record<string, unknown>;

function isStr(reqObj: TReqObj, params: string): string;
function isStr(reqObj: TReqObj, params: ReadonlyArray<string>): string[];
function isStr(
    reqObj: TReqObj,
    params: string | ReadonlyArray<string>,
): string | string[] {
    return _checkWrapper(reqObj, params, _checkStr);
}

function _checkStr(val: unknown): string | undefined {
    if (!!val && typeof val === 'string') {
        return val;
    } else {
        return undefined;
    }
}

function isNum(reqObj: TReqObj, params: string): number;
function isNum(reqObj: TReqObj, params: ReadonlyArray<string>): number[];
function isNum(
    reqObj: TReqObj,
    params: string | ReadonlyArray<string>,
): number | number[] {
    return _checkWrapper(reqObj, params, _checkNum);
}

function _checkNum(val: unknown): number | undefined {
    const valF = Number(val);
    if (!isNaN(valF)) {
        return valF;
    } else {
        return undefined;
    }
}

function isBool(reqObj: TReqObj, params: string): boolean;
function isBool(reqObj: TReqObj, params: ReadonlyArray<string>): boolean[];
function isBool(
    reqObj: TReqObj,
    params: string | ReadonlyArray<string>,
): boolean | boolean[] {
    return _checkWrapper(reqObj, params, _checkBool);
}

function _checkBool(val: unknown): boolean | undefined {
    if (typeof val === 'boolean') {
        return val;
    } else if (typeof val === 'string') {
        val = val.toLowerCase();
        if (val === 'true') {
            return true;
        } else if (val === 'false') {
            return false;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

function isValid<T>(
    reqObj: TReqObj,
    param: string,
    validatorFn: (param: unknown) => param is T,
): T {
    const val = reqObj[param];
    if (validatorFn(val)) {
        return val;
    } else {
        throw new ValidationErr(param);
    }
}

function _checkWrapper<T>(
    reqObj: TReqObj,
    params: string | ReadonlyArray<string>,
    checkFn: (val: unknown) => T | undefined,
): T | T[] {
    if (params instanceof Array) {
        const retVal: T[] = [];
        for (const param of params) {
            const val = checkFn(reqObj[param]);
            if (val !== undefined) {
                retVal.push(val);
            } else {
                throw new ValidationErr(param);
            }
        }
        return retVal;
    }

    const val = checkFn(reqObj[params]);

    if (val !== undefined) {
        return val;
    }

    throw new ValidationErr(params);
}

export default {
    isStr,
    isNum,
    isBool,
    isValid,
} as const;