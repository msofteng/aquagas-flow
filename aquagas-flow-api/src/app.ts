import express, { Application, NextFunction, Request, Response } from 'express';

import '@src/pre-start';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import logger from 'jet-logger';

import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '@src/common/Paths';
import Routes from '@src/interfaces/routes';

import { NODE_ENV, PORT } from '@src/config';
import { NodeEnvs } from '@src/common/misc';
import { RouteError } from '@src/common/classes';
import { IReq, IRes } from '@src/routes/common/types';

import 'express-async-errors';

export default class App {
    public app: Application;
    public env: string;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 80;

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.info('===================================');
            console.info(`======== ENV: ${this.env} =========`);
            console.info(`🚀 Aplicativo rodando na porta ${this.port}`);
            console.info('===================================');
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser(EnvVars.CookieProps.Secret));

        if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
            this.app.use(morgan('dev'));
        }

        if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
            this.app.use(helmet());
        }

        this.app.use((
            err: Error,
            _: Request,
            res: Response,
            next: NextFunction
        ) => {
            if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
                logger.err(err, true);
            }
            
            let status = HttpStatusCodes.BAD_REQUEST;

            if (err instanceof RouteError) {
                status = err.status;
            }

            return res.status(status).json({ error: err.message });
        });

        const viewsDir = path.join(__dirname, 'views');
        this.app.set('views', viewsDir);

        const staticDir = path.join(__dirname, 'public');
        this.app.use(express.static(staticDir));

        this.app.get('/', (_: Request, res: Response) => {
            res.sendFile('login.html', { root: viewsDir });
        });

        this.app.get('/users', (req: IReq, res: IRes) => {
            const jwt = req.signedCookies[EnvVars.CookieProps.Key];
            if (!jwt) {
                res.redirect('/');
            } else {
                res.sendFile('users.html', { root: viewsDir });
            }
        });
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use(Paths.Base, route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use((error: {name: string, message: string, stack?: string, status: number}, req: Request, res: Response, next: NextFunction) => {
            try {
                console.error(`[${req.method}] ${req.path} >> Message:: ${error.message}`);
                res.status(error.status).json({ message: error.message });
            } catch (error) {
                next(error);
            }
        });
    }
}