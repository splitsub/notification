/** Utils, functions and other library imports */
const utils = require("../../utils/utils");

/** Class file imports */
const Constants = require('./Constants');

/** Errors and other constants imports */
const Error = require("../../errorConstants").ERROR;

/**
 * Validate the Call data to make sure that no empty objects are being sent
 *
 * @param data Contains all the details for the call to be sent 
 */
const validateCall = (data) => {
    if (!data.hasOwnProperty('users') || data.users.length === 0) {
        return utils.classResponse(false, {}, utils.errorTemplater(Error.required_object_error, { object: "users" }));
    }
    /** As MSG91 does not support bulk calling we have limited it to N number of calls per request */
    if (data.users.length > Constants.USERS_LIMIT) {
        return utils.classResponse(false, {}, Error.users_limit_error);
    }

    if (data.hasOwnProperty('call')) {
        if (!data.call.hasOwnProperty('content')) {
            data.call.content = '';
        }
        if (!data.call.hasOwnProperty('send')) {
            /** This is set to false and no error is returned because in the future sendAt might be added and then send value can be set to false. */
            data.call.send = false;
        }
        if (!data.call.hasOwnProperty('sendVia')) {
            return utils.classResponse(false, {}, utils.errorTemplater(Error.required_attribute_error, { attribute: "sendVia" }));
        }
        if (!data.call.hasOwnProperty('otp')) {
            data.call.otp = false;
        }
    } else {
        return utils.classResponse(false, {}, utils.errorTemplater(Error.required_object_error, { object: "call" }));
    }

    return utils.classResponse(true, data, '');
};

/**
 * Parse payload that is coming and extract all the data from it 
 * 
 * @param {*} data 
 */
const parseCallPayload = (data) => {
    let phone = [];
    for (let i = 0; i < data.users.phone.length; i++) {
        phone.push({
            number: data.users.phone[i].number,
            countryCode: data.users.phone[i].countryCode
        })
    }

    return {
        phone: phone, // Phone numbers of the users that have been sent
        content: data.call.content, // Message that is to be sent on the call
        sendVia: data.call.sendVia, // Name of the service to be used to make the call
        lang: data.lang, // Language of the message to be sent ( Note: MSG91 currently does not support different languages. )
        otp: data.call.otp // Flag for wether the message is for an OTP or not
    };
};

module.exports = {
    validateCall,
    parseCallPayload
}