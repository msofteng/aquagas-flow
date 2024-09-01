import jsonfile from 'jsonfile';

import { IMeasure } from "@src/models/measure";

const DB_FILE_NAME = 'measures.json';

export default class AquagasOrm {
    openDb(): Promise<IMeasure[]> {
        return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IMeasure[]>;
    }

    saveDb(db: IMeasure[]): Promise<void> {
        return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
    }
}