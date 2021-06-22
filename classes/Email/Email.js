/** Utils, other functions and Library imports */
const utils = require("../../utils/utils");

/** Class Files */
const Functions = require("./Functions");
const Constants = require('./Constants');

/** Third Party Modules */
const ses = require('../../modules/email/ses/ses');

/** Error Constants */
const Error = require('../../errorConstants').ERROR;

/**
 * Send email
 *
 * @param emailData data of the email that needs to be sent 
 * @param reqConfig configuration of the email
 */
const sendEmail = async (data, reqConfig) => {
    let validatedRequest = await Functions.validateEmailPayload(data, reqConfig);
    data = validatedRequest.data || {};
    reqConfig = validatedRequest.reqConfig || {};

    let response = { success: false, data: {}, err: '' };
    switch (data.email.sendVia) {
        case Constants.AWS_SES:
            response = await ses.sendMail(data, reqConfig);
            break;
        default:
            response.err = Error.send_via_error;
    }

    return utils.classResponse(response.success, response.data, response.err);
};

module.exports = {
    sendEmail: sendEmail
};