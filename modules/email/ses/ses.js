/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const functions = require("./functions");

/** Class Files */
const TemplateFunctions = require("../../../classes/Template/Functions");

const Error = require('../../../errorConstants').ERROR;
const Constants = require('./constants');

/**
 * Common function to send emails
 * 
 * @param data data for the email that is to be sent 
 * @param reqConfig configuration of the email that is to be sent
 */
const sendMail = async(data, reqConfig) => {
    let emailMethod = await functions.getSendMethod(data.email);
    switch (emailMethod) {
        case Constants.METHOD_SIMPLE:
            return sendSimpleEMail(data, reqConfig);
            break;
        case Constants.METHOD_RAW:
            return sendRawEMail(data, reqConfig);
            break;
        case Constants.METHOD_BULK:
            return sendBulkEMail(data, reqConfig);
            break;
        default:
            return utils.classResponse(false, {}, Error.check_request_data);
    }
}

/**
 * Send Email to the N users having simple content without template
 * 
 * @param data data for the email that is to be sent 
 * @param reqConfig configuration of the email that is to be sent
 */
const sendSimpleEMail = async(data, reqConfig) => {
    let emailParams = await functions.parseSimpleEmail(data, reqConfig);
    return await functions.sendNonBulkEmail(emailParams, reqConfig);
};

/**
 * Send a raw email
 * 
 * @param params parameter for the email that is to be sent 
 */
const sendRawEMail = async(data, reqConfig) => {
    let emailParams = await functions.parseRawEmail(data, reqConfig);
    return functions.sendNonBulkEmail(emailParams, reqConfig);
};

/**
 * Send Email to the N users
 * 
 * @param data Information regarding the email to be sent
 * @param reqConfig Configuration of the email to be sent 
 */
const sendBulkEMail = async(data, reqConfig) => {
    let sesv2Data = await functions.configureSES(reqConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    let templateNameExists = await TemplateFunctions.checkTempalteNameExistence(data.email.template.templateName, reqConfig);
    if (!templateNameExists) {
        return utils.classResponse(false, {}, Error.template_name_exist_error);
    }
    /**
     * AWS-SESV2 sendBulkEmail
     * For details of the possible errors and success messages please scroll down to the parameters.
     * Documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#sendBulkEmail-property
     * 
     * The Function returns an AWS response object. 
     * Response Object: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Response.html
     */
    let emailParams = await functions.parseBulkEmail(data, reqConfig);
    try {
        const sendBulkEmail = await sesv2.sendBulkEmail(emailParams).promise();
        return utils.classResponse(true, sendBulkEmail, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
};

module.exports = {
    sendMail: sendMail
};