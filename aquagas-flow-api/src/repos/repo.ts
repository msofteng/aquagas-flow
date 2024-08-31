import { IUser } from '@src/models/User';
import { getRandomInt } from '@src/util/misc';

import orm from '@src/repos/MockOrm';

export default class UserRepository {
    async getOne(email: string): Promise<IUser | null> {
        const db = await orm.openDb();
        for (const user of db.users) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    async persists(id: number): Promise<boolean> {
        const db = await orm.openDb();
        for (const user of db.users) {
            if (user.id === id) {
                return true;
            }
        }
        return false;
    }

    async getAll(): Promise<IUser[]> {
        const db = await orm.openDb();
        return db.users;
    }

    async add(user: IUser): Promise<void> {
        const db = await orm.openDb();
        user.id = getRandomInt();
        db.users.push(user);
        return orm.saveDb(db);
    }

    async update(user: IUser): Promise<void> {
        const db = await orm.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === user.id) {
                const dbUser = db.users[i];
                db.users[i] = {
                    ...dbUser,
                    name: user.name,
                    email: user.email,
                };
                return orm.saveDb(db);
            }
        }
    }

    async delete_(id: number): Promise<void> {
        const db = await orm.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === id) {
                db.users.splice(i, 1);
                return orm.saveDb(db);
            }
        }
    }
}