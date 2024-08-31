import { IUser } from '@src/models/user';
import { getRandomInt } from '@src/util/misc';

import UserOrm from './orm/user';

export default class UserRepository {
    orm: UserOrm;

    constructor () {
        this.orm = new UserOrm();
    }

    async getOne(email: string): Promise<IUser | null> {
        const db = await this.orm.openDb();
        for (const user of db.users) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    async persists(id: number): Promise<boolean> {
        const db = await this.orm.openDb();
        for (const user of db.users) {
            if (user.id === id) {
                return true;
            }
        }
        return false;
    }

    async getAll(): Promise<IUser[]> {
        const db = await this.orm.openDb();
        return db.users;
    }

    async add(user: IUser): Promise<void> {
        const db = await this.orm.openDb();
        user.id = getRandomInt();
        db.users.push(user);
        return this.orm.saveDb(db);
    }

    async update(user: IUser): Promise<void> {
        const db = await this.orm.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === user.id) {
                const dbUser = db.users[i];
                db.users[i] = {
                    ...dbUser,
                    name: user.name,
                    email: user.email,
                };
                return this.orm.saveDb(db);
            }
        }
    }

    async delete_(id: number): Promise<void> {
        const db = await this.orm.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === id) {
                db.users.splice(i, 1);
                return this.orm.saveDb(db);
            }
        }
    }
}