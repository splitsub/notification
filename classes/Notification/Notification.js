/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');

/** Class Files */
const Functions = require('./Functions');
const Email = require('../Email/Email');
const SMS = require('../SMS/SMS');
const Push = require('../Push/Push');
const Call = require('../Call/Call');

/**
 * Common function to send notifications.
 * 
 * @param {*} payload contaning details for all the types of notifications 
 * @param {*} reqConfig containing the config for notifications and third party config (if any)
 */
const sendNotification = async(payload, reqConfig) => {
    let data = await utils.parseSafe(payload);
    data = await Functions.validation(data);

    let response = {
        sms: {},
        email: {},
        push: {},
        call: {}
    };

    if (data.email.send) {
        response.email = await Email.sendEmail(data, reqConfig);
    }
    if (data.sms.send) {
        response.sms = await SMS.sendSMS(data, reqConfig);
    }
    if (data.push.send) {
        response.push = await Push.sendPush(data, reqConfig);
    }
    if (data.call.send) {
        response.call = await Call.sendCall(data, reqConfig);
    }

    return response;
};

module.exports = {
    sendNotification: sendNotification,
};