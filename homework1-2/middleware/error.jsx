const winston = require('winston');
require('winston-mongodb')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'My App' },
    transports: [

        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'src/logs/warnings.log', level: 'warning'}),
        new winston.transports.File({ filename: 'src/logs/combined' }),
        new winston.transports.MongoDB({ db: 'mongodb://localhost:37017/node_crud' }),
    ]
});

function error(err, req, res, next){
    logger.error(err.messsage, err);
    res.status(500).send(err);
}