import Routes from "@src/interfaces/routes";
import IValidate from "@src/interfaces/validate";
import { Router, NextFunction } from "express";
import { IReq, IRes } from "./common/types";
import Paths from "@src/common/Paths";
import jetValidator from "jet-validator/lib/jet-validator";
import AquagasController from "@src/controllers/aquagas";
import adminMw from "./middleware/adminMw";

export default class AquagasRoutes implements Routes {
    path: string | undefined;
    router: Router;
    controller: AquagasController;
    validate: IValidate | undefined;

    constructor() {
        this.path = Paths.Aquagas.Base;
        this.router = Router();
        this.validate = jetValidator();
        this.controller = new AquagasController();

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${Paths.Aquagas.Upload}`, this.controller.salvarMedida);
        this.router.patch(`${Paths.Aquagas.Confirm}`, this.controller.confirmarLeitura);
        this.router.get(`/:id${Paths.Aquagas.List}`, this.controller.listarMedidasCliente);
    }
}