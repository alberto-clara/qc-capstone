const express = require('express');
const bodyParser = require('body-parser');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const config = {
    name: 'HomeDepotBackEnd',
    port: 3001 ,
    host: '0.0.0.0',
};
const app = express();
const logger = log({ console: true, file: false, label: config.name });
app.use(bodyParser.json());
app.use(ExpressAPILogMiddleware(logger, { request: true }));


const routes = require('./api/route');
routes(app);
app.listen(config.port, config.host, (e) => {
    if (e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});