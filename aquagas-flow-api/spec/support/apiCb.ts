import { TApiCb, TRes } from '@spec/types/misc';
import { CallbackHandler } from 'supertest';

import moment from 'moment';
import logger from 'jet-logger';

function apiCb(
    cb: TApiCb,
    dateParam = 'created',
    printErr?: boolean,
): CallbackHandler {
    return (err: Error, res: TRes) => {
        if (printErr) {
            logger.err(err);
        }
        _strToDate(res.body, dateParam);
        return cb(res);
    };
}

function _strToDate(
    param: unknown,
    prop: string,
): void {
    return _iterate(param, prop);
}

function _iterate(param: unknown, prop: string): void {
    if (!param || typeof param !== 'object') {
        return;
    }
    const paramF = param as Record<string, unknown>;

    if (Array.isArray(paramF)) {
        for (const item of paramF) {
            _iterate(item, prop);
        }
        return;
    }

    const val = paramF[prop];
    if (
        (typeof val !== 'undefined') &&
        !((typeof val === 'string') || (val instanceof Date)) &&
        !moment(val as string | Date).isValid()
    ) {
        throw new Error('Property must be a valid date-string or Date() object');
    }

    if (typeof val !== 'undefined') {
        paramF[prop] = new Date(val as string | Date);
    }
    for (const key in paramF) {
        const oval = paramF[key];
        if (typeof oval === 'object' && key !== prop) {
            _iterate(oval, prop);
        }
    }
}

export default apiCb;