/**
 * Parse payload that is coming and extract all the data from it 
 * 
 * @param {*} data 
 */
const parseSMSPayload = (data) => {
    let phone = [];
    for (let i = 0; i < data.users.phone.length; i++) {
        phone.push({
            number: data.users.phone[i].number,
            countryCode: data.users.phone[i].countryCode
        })
    }

    return {
        phone: phone,
        content: data.sms.content,
        sendVia: data.sms.sendVia,
        lang: data.lang,
        otp: data.sms.otp
    };
};

/**
 * Validate the SMS data to make sure that no empty objects are being sent
 *
 * @param data
 */
const validateSMS = async(data) => {
    if (data.hasOwnProperty('sms')) {
        if (!data.sms.hasOwnProperty('content')) {
            data.sms.content = '';
        }
        if (!data.sms.hasOwnProperty('send')) {
            data.sms.send = '';
        }
        if (!data.sms.hasOwnProperty('sendVia')) {
            data.sms.sendVia = '';
        }
        if (!data.sms.hasOwnProperty('otp')) {
            data.sms.otp = false;
        }
    } else {
        data.sms = {
            content: '',
            send: false,
            sendVia: '',
            otp: false,
        };
    }
    return data;
};

module.exports = {
    validateSMS,
    parseSMSPayload
}