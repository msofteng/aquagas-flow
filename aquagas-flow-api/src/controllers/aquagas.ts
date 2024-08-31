import { IReq, IRes } from "@src/routes/common/types";
import AquagasFlowService from "@src/services/aquagas";

export default class AquagasController {
    service: AquagasFlowService;

    constructor () {
        this.service = new AquagasFlowService();
    }
    
    salvarMedida = async (req: IReq, res: IRes) => {
        return this.service.salvarMedicao(req, res);
    };

    confirmarLeitura = async (req: IReq, res: IRes) => {
        return this.service.confirmarMedicao(req, res);
    };

    listarMedidasCliente = async (req: IReq, res: IRes) => {
        return this.service.listarMedidas(req, res);
    };
}