/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');

/** Class Files */
const Functions = require('./Functions');
const Constants = require('./Constants');

/** Third Party Modules */
const sns = require("../../modules/sms/sns/sns");
const msg91 = require("../../modules/sms/msg91/msg91");
const twilio = require('../../modules/sms/twilio/twilio');

/** Error Constants */
const Error = require('../../errorConstants').ERROR;

/**
 * Common function to send SMS based on the sendVia field ( contains the name of the service to be used)
 * 
 * @param {*} data Content of the message and who it should be sent to and at what time etc.
 * @param {*} reqConfig Configuration for the SMS and the service to be used 
 */
const sendSMS = async (data, reqConfig) => {
    data = await Functions.validateSMS(data);
    data = Functions.parseSMSPayload(data);

    let response = { success: false, data: {}, err: '' };
    switch (data.sendVia) {
        case Constants.AWS_SNS:
            response = await sns.sendSMS(data, reqConfig);
            break;
        case Constants.MSG91:
            response = await msg91.sendSMS(data, reqConfig);
            break;
        case Constants.TWILIO:
            response = await twilio.sendSMS(data, reqConfig);
            break;
        default:
            response.err = Error.send_via_error;
    }

    return utils.classResponse(response.success, response.data, response.err);
};

module.exports = {
    sendSMS: sendSMS
};