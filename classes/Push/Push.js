/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');

/** Class Files */
const Constants = require('./Constants');
const Functions = require('./Functions');

/** Third Party Modules */
const oneSignal = require("../../modules/push/oneSignal/oneSignal");
const expo = require("../../modules/push/expo/expo");

/** Error Constants */
const Error = require('../../errorConstants').ERROR;

/**
 * Common function to send notification based on operator/service
 * 
 * @param {*} data Details regarding the push notification
 * @param {*} reqConfig Configuration for the service and the notification to be sent 
 */
const sendPush = async (data, reqConfig) => {
    data = await Functions.validatePush(data);
    data = Functions.parsePushPayload(data);

    let response = { success: false, data: {}, err: '' };
    switch (data.sendVia) {
        case Constants.ONESIGNAL:
            response = await oneSignal.sendPushNotification(data, reqConfig);
            break;
        case Constants.EXPO:
            response = await expo.androidHelper(data, reqConfig);
            break;
        default:
            response.err = Error.send_via_error;
    }

    return utils.classResponse(response.success, response.data, response.err);
};

module.exports = {
    sendPush: sendPush
};