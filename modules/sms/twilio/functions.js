/** Utils, library and other function imports */
const utils = require('../../../utils/utils');

/** Error and other constant imports */
const Error = require('../../../errorConstants').ERROR;

/**
 * Validate Twilio Config
 * 
 * @param {*} config Configuration sent in the request
 */
const validateConfig = (config) => {
    if (config.hasOwnProperty('twilio')) {
        if (!config.twilio.hasOwnProperty('accountSid')) {
            return utils.classResponse(false, {}, Error.config_error)
        }
        if (!config.twilio.hasOwnProperty('authToken')) {
            return utils.classResponse(false, {}, Error.config_error)
        }
    } else {
        return utils.classResponse(false, {}, Error.config_error)
    }
    return utils.classResponse(true, {}, '')
}

module.exports = {
    validateConfig
}