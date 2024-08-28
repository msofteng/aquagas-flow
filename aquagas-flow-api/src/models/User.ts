import moment from 'moment';

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' +
    'with the appropriate user keys.';

export enum UserRoles {
    Standard,
    Admin,
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    created: Date;
    role: UserRoles;
    pwdHash?: string;
}

export interface ISessionUser {
    id: number;
    email: string;
    name: string;
}

function new_(
    name?: string,
    email?: string,
    created?: Date,
    role?: UserRoles,
    pwdHash?: string,
    id?: number,
): IUser {
    return {
        id: (id ?? -1),
        name: (name ?? ''),
        email: (email ?? ''),
        created: (created ? new Date(created) : new Date()),
        role: (role ?? UserRoles.Standard),
        ...(pwdHash ? { pwdHash } : {}),
    };
}

function from(param: object): IUser {
    if (!isUser(param)) {
        throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    return new_(param.name, param.email, param.created, param.id);
}

function isUser(arg: unknown): arg is IUser {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'id' in arg && typeof arg.id === 'number' &&
        'email' in arg && typeof arg.email === 'string' &&
        'name' in arg && typeof arg.name === 'string' &&
        'created' in arg && moment(arg.created as string | Date).isValid()
    );
}

export default {
    new: new_,
    from,
    isUser,
} as const;