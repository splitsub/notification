/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const functions = require('./functions');

/** Error Constants */
const Error = require('../../../errorConstants').ERROR;
const constants = require('./constants');

/**
 * Creates the message parameters and sends them to the Twilio API
 * 
 * @param {*} data contains the phone numbers with their country codes
 * @param {*} message Message content to be send to the user    
 * @param {*} reqConfig Configuration for message 91
 */
const twilioPublish = async (data, message, reqConfig) => {
    let config = reqConfig.twilio || {};

    const client = require('twilio')(config.accountSid, config.authToken);

    try {
        let toNumber = utils.stringConcatinator(data.countryCode, data.number);
        let twilioResponse = await client.messages
            .create({
                body: message,
                from: config.senderId,
                to: toNumber
            });
        return utils.classResponse(true, twilioResponse, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Send SMS using Twilio, this function formats the data and sends it to the publish function 
 * 
 * @param {*} data Data containing the details of the SMS to be sent 
 * @param {*} reqConfig Configuration for the service
 */
const sendSMS = async (data, reqConfig) => {
    let sentInformation = [];
    let message = data.content;

    let validateConfig = functions.validateConfig(reqConfig);
    if (!validateConfig.success) {
        return utils.classResponse(validateConfig.success, validateConfig.data, validateConfig.err);
    }

    for (let i = 0; i < data.phone.length; i++) {
        if (message.length > constants.MESSAGE_LIMIT) {
            return utils.classResponse(false, {}, Error.sms_message_limit_error);
        }

        let sentData = await twilioPublish(data.phone[i], message, reqConfig, data.otp);
        sentInformation.push(sentData)
    }
    return utils.classResponse(true, sentInformation, '');
};

module.exports = {
    sendSMS
}