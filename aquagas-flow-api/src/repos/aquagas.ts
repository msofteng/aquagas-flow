import { IMeasure } from "@src/models/measure";
import AquagasOrm from "./orm/aquagas";
import { getRandomInt } from "@src/util/misc";
import moment from "moment";

export default class AquagasRepository {
    orm: AquagasOrm;

    constructor () {
        this.orm = new AquagasOrm();
    }

    async getAll(): Promise<IMeasure[]> {
        const db = await this.orm.openDb();
        return db;
    }

    async add(measure: IMeasure): Promise<void> {
        const db = await this.orm.openDb();
        db.push(measure);
        return this.orm.saveDb(db);
    }

    async update(measureUuid: string, confirmedValue: number): Promise<void> {
        const db = await this.orm.openDb();
        for (let i = 0; i < db.length; i++) {
            if (db[i].measure_uuid === measureUuid && db[i].has_confirmed == false) {
                const measure = db[i];
                db[i] = {
                    ...measure,
                    measure_value: confirmedValue,
                    has_confirmed: true
                };
                return this.orm.saveDb(db);
            }
        }
    }

    async persists(measure: IMeasure): Promise<boolean> {
        const db = await this.orm.openDb();
        for (const meas of db) {
            if (
                moment(meas.measure_datetime).format('mm/yyyy') == moment(measure.measure_datetime).format('mm/yyyy') &&
                meas.measure_type == measure.measure_type &&
                meas.customer_code == measure.customer_code
            ) {
                return true;
            }
        }
        return false;
    }

    async persistsConfirm(measure: IMeasure): Promise<boolean> {
        const db = await this.orm.openDb();
        for (const meas of db) {
            if (
                meas.measure_uuid == measure.measure_uuid &&
                meas.has_confirmed
            ) {
                return true;
            }
        }
        return false;
    }
}