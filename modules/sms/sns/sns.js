/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const functions = require('./functions');
const constants = require('./constants');

/** Error Constants */
const Error = require('../../../errorConstants').ERROR;

/**
 * Creates the message parameters and sends them to the SNS API
 * 
 * @param {*} phoneNumber contains the phone numbers with their country codes
 * @param {*} message Message content to be send to the user    
 * @param {*} reqConfig Configuration for message 91
 */
const awsPublish = async(phoneNumber, message, reqConfig) => {
    let snsData = await functions.configureSNS(reqConfig);
    if (!snsData.success) {
        return snsData;
    }
    const SNS = snsData.data;
    let smsConfig = reqConfig.sms || {};
    let senderId = smsConfig.senderId || 'TEST';
    let messageType = smsConfig.messageType || 'Promotional';

    return new Promise((resolve, reject) => {
        SNS.publish({
            PhoneNumber: phoneNumber,
            Message: message,
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: messageType
                },
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': senderId
                }
            }
        }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
};

/**
 * Send SMS using SNS, this function formats the data and sends it to the publish function 
 * 
 * @param {*} data Data containing the details of the SMS to be sent 
 * @param {*} reqConfig Configuration for the service
 */
const sendSMS = async(data, reqConfig) => {
    let sentInformation = [];
    let message = data.content || "";

    for (let i = 0; i < data.phone.length; i++) {
        let formatPhone = functions.parsePhoneNumber(data.phone[i]);
        if (message.length > constants.MESSAGE_LIMIT) {
            return utils.classResponse(false, {}, Error.sms_message_limit_error);
        }
        let sentData = await awsPublish(formatPhone, message, reqConfig);
        sentInformation.push(sentData);
    }
    return utils.classResponse(true, sentInformation, '');
};

module.exports = {
    sendSMS
}