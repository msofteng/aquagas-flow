import AquagasOrm from "./orm/aquagas";

export default class AquagasRepository {
    orm: AquagasOrm;

    constructor () {
        this.orm = new AquagasOrm();
    }
}