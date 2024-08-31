

import jsonfile from 'jsonfile';

import { IUser } from '@src/models/user';

const DB_FILE_NAME = 'users.json';

interface IDb {
    users: IUser[];
}

export default class UserOrm {
    openDb(): Promise<IDb> {
        return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
    }

    saveDb(db: IDb): Promise<void> {
        return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
    }    
}