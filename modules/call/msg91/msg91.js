/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const functions = require('./functions');

const _ = require('lodash');
const url = require('url');

/** Error and other constants */
const Error = require('../../../errorConstants').ERROR;
const constants = require('./constants');

/**
 * Creates the message parameters and sends them to the MSG91 API
 * 
 * @param {*} data contains the phone numbers with their country codes
 * @param {*} message Message content to be send to the user    
 * @param {*} reqConfig Configuration for message 91
 * @param {*} otp Flag for wether the message is an OTP call or not
 */
const msg91Call = async (data, message, reqConfig, otp = false) => {
    let config = reqConfig.msg91 || {};

    let options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "http://api.msg91.com/api/retryotp.php?authkey=" + config.authKey + "&mobile=" + data.countryCode + data.number,
        "headers": {}
    };

    let res = await utils.makeRequest(options.path, options.method, options.headers);
    return res;
}

/**
 * Send Call using MSG91, this function formats the data and sends it to the publish function 
 * 
 * @param {*} data Data containing the details of the Call to be sent 
 * @param {*} reqConfig Configuration for the service
 */
const sendCall = async (data, reqConfig) => {
    let validateConfig = functions.validateConfig(reqConfig);
    if (!validateConfig.success) {
        return utils.classResponse(validateConfig.success, validateConfig.data, validateConfig.err);
    }
    let message = data.content;
    let callRequests = [];

    for (let i = 0; i < data.phone.length; i++) {
        data.phone[i].countryCode = _.trim(data.phone[i].countryCode, '+');
        callRequests[i] = await msg91Call(data.phone[i], message, reqConfig, data.otp);
    }

    return utils.classResponse(true, callRequests, '');
};

module.exports = {
    sendCall
}