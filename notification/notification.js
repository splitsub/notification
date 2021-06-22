/** Utils, other functions and Library imports */
const utils = require('../utils/utils');

/** Class Files */
const Notification = require('../classes/Notification/Notification');
const template = require('../template/template');

/**
 * Send Any type of notification
 * 
 * @param information regarding the notification
 */
const sendNotification = async (body) => {
    let reqConfig = body.config || {};

    try {
        let notify = await Notification.sendNotification(body, reqConfig);
        return utils.classResponse(true, notify, '');
    } catch (err) {
        let slackConfig = reqConfig.slack || { url: "" };
        await utils.sendSlack(slackConfig.url, { body, err });
        return utils.classResponse(false, {}, err);
    }
};

module.exports = {
    sendNotification,
    template
};