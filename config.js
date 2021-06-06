const utils = require('./utils/utils');
const dotenv = require('dotenv');

dotenv.config();

const DEV_DATABASE_CONFIG = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
}
DEV_DATABASE_CONFIG.logging = process.env.DB_LOGGING === '1' ? utils.log : false;

const LOG_DUMP = process.env.LOG_DUMP === '1' ? true : false;

module.exports = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    DEV_DATABASE_CONFIG,
    LOG_DUMP
};