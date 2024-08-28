import { RequestHandler } from "express";

export default interface IValidate {
    (...params: Array<string | {
        0: string;
        1?: string | ((arg: unknown) => boolean);
        2?: 'body' | 'query' | 'params';
    }>): RequestHandler;
}