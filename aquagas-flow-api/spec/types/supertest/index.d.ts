import 'supertest';

import { IUser } from '@src/models/User';

declare module 'supertest' {
    export interface Response {
        headers: Record<string, string[]>;
        body: {
            error: string;
            users: IUser[];
        };
    }
}