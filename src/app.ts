import 'reflect-metadata';
import * as express from 'express';
import * as winston from 'winston';
import { router } from './routes/routes.js'
import type { IncomingMessage } from 'http'
import { logErrorMiddleware, LoggerFactory, errorHandlerMiddleware } from 'wallet-common-lib';
import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express';

/**
 * Main class for application which is going to run as a server
 */
class App {
    private port = process.env.PORT ? process.env.PORT : 8080;
    private logger: winston.Logger = LoggerFactory.create(App.name);

    public async run(): Promise<void> {
        const start = Date.now();
        const app: express.Application = express()

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        const swaggerOptions = {
            apis: [__dirname + '/controllers/*.js', __dirname + '/models/*.js'],
            swaggerDefinition: {
                basePath: '/api/v1',
                consumes: ['application/json'],
                info: {
                    contact: {
                        name: 'IBM'
                    },
                    title: 'misc-Service',
                    version: '1.0.0'
                },
                produces: ['application/json'],
                schemes: ['http', 'https'],
                securityDefinitions: {
                    Bearer: {
                        in: 'header',
                        name: 'Authorization',
                        type: 'apiKey',
                        description: 'Enter the token with the `Bearer: ` prefix'
                    }
                },
                uiConfig: {
                    docExpansion: 'none', //  none|list|full
                    deepLinking: false
                },
            }
        };

        // set up openapi doc
        const swaggerSpec = swaggerJSDoc(swaggerOptions);

        app.get('/swagger.json', (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });

        // set up swagger ui
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: false,
            swaggerOptions: {
                docExpansion: "none"
            }
        }));

        app.use('/api/v1', router);
        app.use(logErrorMiddleware);
        app.use(errorHandlerMiddleware);

        // start the server
        app.listen(this.port, () => {
            this.logger.info(`App listens on port ${this.port}`);
            const duration = Date.now() - start;
            this.logger.debug(`Server startup time: ${duration}`);
        });
    }

    private static getHeader(req: IncomingMessage, key: string): string {
        const obj = req.headers[key];
        let val = null;
        if (obj) {
            val = obj.toString();
        }
        return val;
    }

}

process.on('unhandledRejection', (error: Error) => {
    LoggerFactory.create(App.name).error('Unhandled rejection: ' + (error.stack ? error.stack : error));
});

process.on('uncaughtException', (error: Error) => {
    LoggerFactory.create(App.name).error('uncaughtException: ' + (error.stack ? error.stack : error));
});


//dotenv.config();

const appSrv = new App();

// start client application
appSrv.run();

