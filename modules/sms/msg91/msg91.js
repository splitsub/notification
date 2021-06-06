/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const _ = require('lodash');
const constants = require('./constants');
const functions = require('./functions');

/** Error Constants */
const Error = require('../../../errorConstants').ERROR;

/**
 * Creates the message parameters and sends them to the MSG91 API
 * 
 * @param {*} data contains the phone numbers with their country codes
 * @param {*} message Message content to be send to the user    
 * @param {*} reqConfig Configuration for message 91
 * @param {*} otp Flag for wether the message is an OTP SMS or not
 */
const msg91Publish = async(data, message, reqConfig, otp = false) => {
    let config = reqConfig.msg91 || {};
    message = encodeURIComponent(message)
    let options = {}

    if (!otp) {
        options = {
            "method": "GET",
            "hostname": "api.msg91.com",
            "port": null,
            "path": "https://api.msg91.com/api/sendhttp.php?authkey=" + config.authKey + "&mobiles=" + data.number + "&country=" + data.countryCode + "&message=" + message + "&sender=" + config.sender + "&route=" + config.route,
            "headers": {}
        };
    } else {
        options = {
            "method": "POST",
            "hostname": "api.msg91.com",
            "port": null,
            "path": "https://api.msg91.com/api/v5/otp?mobile=" + data.countryCode + data.number + "&otp=" + message + "&authkey=" + config.authKey + "&template_id=" + config.templateId,
            "headers": {
                "content-type": "application/json"
            }
        };
    }
    let res = await utils.makeRequest(options.path, options.method, options.headers);
    return res
}

/**
 * Send SMS using MSG91, this function formats the data and sends it to the publish function 
 * 
 * @param {*} data Data containing the details of the SMS to be sent 
 * @param {*} reqConfig Configuration for the service
 */
const sendSMS = async(data, reqConfig) => {
    let sentInformation = [];
    let message = data.content;

    let validateConfig = functions.validateConfig(reqConfig);
    if (!validateConfig.success) {
        return utils.classResponse(validateConfig.success, validateConfig.data, validateConfig.err);
    }

    for (let i = 0; i < data.phone.length; i++) {
        data.phone[i].countryCode = _.trim(data.phone[i].countryCode, '+')
        if (message.length > constants.MESSAGE_LIMIT) {
            return utils.classResponse(false, {}, Error.sms_message_limit_error);
        }
        let sentData = await msg91Publish(data.phone[i], message, reqConfig, data.otp);
        sentInformation.push(sentData)
    }
    return utils.classResponse(true, sentInformation, '');
};

module.exports = {
    sendSMS
}