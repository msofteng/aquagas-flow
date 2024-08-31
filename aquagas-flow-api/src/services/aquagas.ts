import { IErrorMeasure, IReqMeasure } from "@src/models/measure";
import AquagasRepository from "@src/repos/aquagas";
import { IReq, IRes } from "@src/routes/common/types";
import moment from "moment";

function isMeasure(arg: object): arg is IReqMeasure {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'image' in arg && typeof arg.image === 'string' &&
        'customer_code' in arg && typeof arg.customer_code === 'string' &&
        'measure_datetime' in arg && moment(arg.measure_datetime as string | Date).isValid() &&
        'measure_type' in arg && typeof arg.measure_type === 'string' && (arg.measure_type == 'WATER' || arg.measure_type == 'GAS')
    );
}

export default class AquagasFlowService {
    repository: AquagasRepository;

    constructor () {
        this.repository = new AquagasRepository();
    }

    salvarMedicao(req: IReq, res: IRes): IRes {
        if (isMeasure(req.body)) {
            return res.status(200).json({});
        } else {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
            } as IErrorMeasure)
        }
    }

    confirmarMedicao(req: IReq, res: IRes): IRes {
        return res.json({});
    }

    listarMedidas(req: IReq, res: IRes): IRes {
        return res.json({});
    }
}