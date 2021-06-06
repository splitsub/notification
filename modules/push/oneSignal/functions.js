/** Utils, library and other function imports */
const utils = require('../../../utils/utils');

/** Error and other constant imports */
const Error = require('../../../errorConstants').ERROR;

/**
 * Validate the onesignal configuration being sent in the request
 * 
 * @param {*} config 
 */
const validateConfig = (config) => {
    if (config.hasOwnProperty('onesignal')) {
        if (!config.onesignal.hasOwnProperty('appId') || !config.onesignal.hasOwnProperty('restApiKey') || !config.onesignal.hasOwnProperty('url')) {
            return utils.classResponse(false, {}, Error.onesignal_config_error);
        }
    } else {
        return utils.classResponse(false, {}, Error.onesignal_config_error);
    }
    return utils.classResponse(true, {}, '');
}

module.exports = {
    validateConfig
}