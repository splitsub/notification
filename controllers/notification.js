/** Utils, other functions and Library imports */
const utils = require('../utils/utils');

/** Class Files */
const Notification = require('../classes/Notification/Notification');

/**
 * Send Any type of notification
 * 
 * @param information regarding the notification
 */
const notification = utils.asyncMiddleware(async(req, res, next) => {
    let body = req.body;
    let reqConfig = body.config || {};

    try {
        let notify = await Notification.sendNotification(body, reqConfig);
        utils.log("RequestBody: ", body, "Response =========== ", notify);
        return utils.sendResponse(req, res, true, notify, '');
    } catch (err) {
        let slackConfig = reqConfig.slack || { url: "" };
        await utils.sendSlack(slackConfig.url, { body, err });
        return utils.sendResponse(req, res, false, {}, err);
    }
});

module.exports = {
    notification
};