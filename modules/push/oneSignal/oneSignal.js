/** Utils, other functions and Library imports */
const moment = require('moment');
const utils = require('../../../utils/utils');
const functions = require('./functions');

/**
 * Send Push notification using oneSingal API
 * 
 * @param {*} data Contains the users list and the content of the notification
 * @param {*} reqConfig Contains the configuration for OneSignal
 */
const sendPushNotification = async(data, reqConfig) => {
    let validateConfig = functions.validateConfig(reqConfig);
    if (!validateConfig.success) {
        return utils.classResponse(validateConfig.success, validateConfig.data, validateConfig.err);
    }

    const onesignalConfig = reqConfig.onesignal;
    const AppId = onesignalConfig.appId;
    const RestApiKey = onesignalConfig.restApiKey;
    const url = onesignalConfig.url;

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + RestApiKey
    };

    let sendAt = data.sendAt;
    let users = data.id;
    let groupKey = data.groupKey;
    let content = data.content;
    let sound = data.sound;
    let additionalData = data.additionalData

    // add user to one-signal format
    let filters = [];
    users.forEach((user) => {
        let temp = { 'field': 'tag', 'key': 'userId', 'relation': '=', 'value': user };
        let add = { 'operator': 'OR' };
        filters.push(temp);
        filters.push(add);
    });
    filters.pop();

    let params = {
        app_id: AppId,
        contents: {
            'en': content
        },
        ios_sound: sound,
        android_sound: sound,
        filters: filters,
        data: additionalData
    };

    // check to group messages if belong to same group
    if (groupKey) {
        params.android_group = groupKey;
        params.android_group_message = '$[notif_count] more messages'
    }
    // check if notification is to be send now or not
    if (moment().unix() < sendAt) {
        params.send_after = moment.utc(sendAt).toDate().toString()
    }

    let res = await utils.makeRequest(url, "POST", headers, params);

    return utils.classResponse(res.success, res.data, res.err);
};

module.exports = {
    sendPushNotification
}