export interface IErrorMeasure {
    error_code: string;
    error_description: string;
}

// /upload                  [POST]

export interface IReqMeasure {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: "WATER" | "GAS";
}   

export interface IResMeasure {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
}

// /confirm                 [PATCH]

export interface IReqMeasureConfirm {
    measure_uuid: string;
    confirmed_value: number;
}

export interface IResMeasureConfirm {
    success: boolean;
}

// /:customer_code:/list    [GET]

export interface IMeasure {
    measure_uuid: string;
    measure_datetime: string;
    measure_type: "WATER" | "GAS";
    has_confirmed: boolean;
    image_url: string;
}

export interface IResMeasureList {
    customer_code: string;
    measures: IMeasure[];
}