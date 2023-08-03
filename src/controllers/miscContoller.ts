import { Request, Response } from 'express';
import { HttpCode } from 'wallet-common-lib';


export const config = (request: Request, response: Response) => {
    const configName = request.query.configName;
    response.status(HttpCode.OK);
    response.json({ name: configName, value: process.env.configName });
}