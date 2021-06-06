/** Utils, library and other function imports */
const utils = require('../../../utils/utils');

/** Error and other constant imports */
const Error = require('../../../errorConstants').ERROR;

/**
 * Validate MSG91 Config
 * 
 * @param {*} config Configuration sent in the request
 */
const validateConfig = (config) => {
    if (config.hasOwnProperty('msg91')) {
        if (!config.msg91.hasOwnProperty('authKey')) {
            return utils.classResponse(false, {}, Error.msg91_config_error)
        }
    } else {
        return utils.classResponse(false, {}, Error.msg91_config_error)
    }
    return utils.classResponse(true, {}, '')
}

module.exports = {
    validateConfig
}