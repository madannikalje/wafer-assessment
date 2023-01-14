import { validatorErrorHandler } from './middlewares/validators';
import { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import { errors, isCelebrateError } from 'celebrate'
import passport from 'passport';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { router } from './routes';
import './strategies'
import * as session from 'express-session'
import { STATUS_CODES } from 'http';

export const startServer = async ( ) => {
    const app: Express = express();
    const port = process.env['PORT'];
    app.set("port", port);
    app.use(express.json());
    app.use(bodyParser());
    app.use(express.urlencoded({ limit: "300mb", extended: true }));
    app.use('/api',router)
    app.use( errors() )
    app.use(validatorErrorHandler)

    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    });
}
