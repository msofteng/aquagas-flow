import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { IErrorMeasure, IMeasure, IReqMeasure, IReqMeasureConfirm } from "@src/models/measure";
import AquagasRepository from "@src/repos/aquagas";
import { IReq, IRes } from "@src/routes/common/types";
import { getRandomInt } from "@src/util/misc";
import moment from "moment";
import sharp from "sharp";

async function isMeasure(arg: object): Promise<boolean> {
    const isBase64Image = async (str: string): Promise<boolean> => {
        const base64UriPattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
        const base64PurePattern = /^[A-Za-z0-9+/]+[=]{0,2}$/;

        let base64Data = str;
        let mimeType = '';

        if (base64UriPattern.test(str)) {
            mimeType = (str.match(/data:([^;]+);base64,/) ?? '')[1];
            base64Data = str.split(',')[1];
        } else if (base64PurePattern.test(str)) {
            mimeType = 'application/octet-stream';
        } else {
            return false;
        }

        try {
            const buffer = Buffer.from(base64Data, 'base64');

            // Usando sharp para tentar processar a imagem e validar
            await sharp(buffer).metadata();
            return true;
        } catch (error) {
            return false;
        }
    };

    return (
        !!arg &&
        typeof arg === 'object' &&
        'image' in arg && typeof arg.image === 'string' && await isBase64Image(arg.image) &&
        'customer_code' in arg && typeof arg.customer_code === 'string' &&
        'measure_datetime' in arg && moment(arg.measure_datetime as string | Date).isValid() &&
        'measure_type' in arg && typeof arg.measure_type === 'string' && (arg.measure_type == 'WATER' || arg.measure_type == 'GAS')
    );
}

function isMeasureConfirm(arg: object): arg is IReqMeasureConfirm {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'measure_uuid' in arg && typeof arg.measure_uuid === 'string' &&
        'confirmed_value' in arg && typeof arg.confirmed_value === 'number'
    );
}

function isMeasureSearch(arg: object): boolean {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'measure_type' in arg && typeof arg.measure_type === 'string'
    );
}

const error: IErrorMeasure = {
    error_code: 'INVALID_DATA',
    error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
};

export default class AquagasFlowService {
    repository: AquagasRepository;

    constructor () {
        this.repository = new AquagasRepository();
    }

    async salvarMedicao(req: IReq, res: IRes): Promise<IRes> {
        let response = {
            status: 0,
            body: {}
        };

        if (await isMeasure(req.body)) {
            let request = req.body as unknown as IReqMeasure;

            let measure: IMeasure = {
                measure_uuid: getRandomInt().toString(),
                measure_datetime: request.measure_datetime,
                measure_value: 100,
                measure_type: request.measure_type,
                has_confirmed: false,
                image_url: "http://",
                customer_code: request.customer_code
            };

            if (!(await this.repository.persists(measure))) {
                this.repository.add(measure);

                response = {
                    status: HttpStatusCodes.OK,
                    body: {
                        image_url: measure.image_url,
                        measure_value: measure.measure_value,
                        measure_uuid: measure.measure_uuid
                    }
                };
            } else {
                response = {
                    status: HttpStatusCodes.CONFLICT,
                    body: {
                        error_code: "DOUBLE_REPORT",
                        error_description: "Leitura do mês já realizada"
                    }
                };
            }
        } else {
            response = {
                status: HttpStatusCodes.BAD_REQUEST,
                body: error
            };
        }

        return res.status(response.status).json(response.body);
    }

    async confirmarMedicao(req: IReq, res: IRes): Promise<IRes> {
        let response = {
            status: 0,
            body: {}
        };

        if (isMeasureConfirm(req.body)) {
            let medicao = await this.repository.get(req.body.measure_uuid);

            if (medicao) {
                if (!medicao.has_confirmed) {
                    this.repository.update(medicao.measure_uuid, req.body.confirmed_value);

                    response = {
                        status: HttpStatusCodes.OK,
                        body: {
                            success: true
                        }
                    }
                } else {
                    response = {
                        status: HttpStatusCodes.CONFLICT,
                        body: {
                            error_code: "CONFIRMATION_DUPLICATE",
                            error_description: "Leitura do mês já realizada"
                        }
                    }
                }
            } else {
                response = {
                    status: HttpStatusCodes.NOT_FOUND,
                    body: {
                        error_code: "MEASURE_NOT_FOUND",
                        error_description: "Leitura do mês já realizada"
                    }
                }
            }
        } else {
            response = {
                status: HttpStatusCodes.BAD_REQUEST,
                body: error
            };
        }

        return res.status(response.status).json(response.body);
    }

    async listarMedidas(req: IReq, res: IRes): Promise<IRes> {
        let response = {
            status: 0,
            body: {}
        };

        const medidas = await this.repository.getAll();

        let medidasFiltradas = [];

        if (req.query && isMeasureSearch(req.query)) {
            if (`${req.query.measure_type}`.toUpperCase() == 'WATER' || `${req.query.measure_type}`.toUpperCase() == 'GAS') {
                medidasFiltradas = medidas.filter(meas => meas.customer_code == req.params.id && meas.measure_type.toLowerCase() == `${req.query.measure_type}`.toLowerCase()).map((measure) => {
                    return {
                        measure_uuid: measure.measure_uuid,
                        measure_datetime: measure.measure_datetime,
                        measure_type: measure.measure_type,
                        has_confirmed: measure.has_confirmed,
                        image_url: measure.image_url
                    }
                });

                response = {
                    status: HttpStatusCodes.OK,
                    body: {
                        customer_code: req.params.id,
                        measures: medidasFiltradas
                    }
                };
            } else {
                response = {
                    status: HttpStatusCodes.BAD_REQUEST,
                    body: {
                        error_code: "INVALID_TYPE",
                        error_description: "Tipo de medição não permitida"
                    }
                };
            }
        } else {
            medidasFiltradas = medidas.filter(meas => meas.customer_code == req.params.id).map((measure) => {
                return {
                    measure_uuid: measure.measure_uuid,
                    measure_datetime: measure.measure_datetime,
                    measure_type: measure.measure_type,
                    has_confirmed: measure.has_confirmed,
                    image_url: measure.image_url
                }
            });

            response = {
                status: HttpStatusCodes.OK,
                body: {
                    customer_code: req.params.id,
                    measures: medidasFiltradas
                }
            };
        }

        if (medidasFiltradas.length == 0 && response.status != HttpStatusCodes.BAD_REQUEST) {
            response = {
                status: HttpStatusCodes.NOT_FOUND,
                body: {
                    error_code: "MEASURES_NOT_FOUND",
                    error_description: "Nenhuma leitura encontrada"
                }
            };
        }

        return res.status(response.status).json(response.body);
    }
}