/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');

/** Class Files */
const Functions = require('./Functions');
const NotificationDumpFunctions = require('../NotificationDump/Functions');
const Constants = require('./Constants');
const NotificationDumpConstants = require('../NotificationDump/Constants');

/** Third Party Modules */
const msg91 = require("../../modules/call/msg91/msg91");

/** Error Constants */
const Error = require('../../errorConstants').ERROR;

/**
 * Common function to send Call based on the sendVia field ( contains the name of the service to be used)
 * 
 * @param {*} data Content of the message and who it should be sent to and at what time etc.
 * @param {*} reqConfig Configuration for the Call and the service to be used 
 */
const sendCall = async(data, reqConfig) => {
    let dataValidity = Functions.validateCall(data);
    if (!dataValidity.success) {
        return utils.classResponse(dataValidity.success, dataValidity.data, dataValidity.err);
    }
    data = dataValidity.data;
    data = Functions.parseCallPayload(data);

    let response = { success: false, data: {}, err: '' };
    switch (data.sendVia) {
        case Constants.SERVICE_MSG91:
            response = await msg91.sendCall(data, reqConfig);
            break;
        default:
            response.err = Error.send_via_error;
    }

    let responseDump = response.success ? response.data : response.err;
    NotificationDumpFunctions.postNotificationDump(reqConfig, data, NotificationDumpConstants.TYPE_CALL, responseDump, '');

    return utils.classResponse(response.success, response.data, response.err);
};

module.exports = {
    sendCall
};