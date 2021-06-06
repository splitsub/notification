/**
 * Parse request payload to extract the data needed for Push notification
 * 
 * @param {*} data 
 */
const parsePushPayload = (data) => {
    let id = [];
    let expoToken = [];
    for (let i = 0; i < data.users.id.length; i++) {
        id.push(data.users.id[i])
    }
    if (data.users.hasOwnProperty('expoToken')) {
        for (let j = 0; j < data.users.expoToken.length; j++) {
            expoToken.push(data.users.expoToken[j]);
        }
    }
    return {
        id,
        expoToken,
        content: data.push.content,
        sendVia: data.push.sendVia,
        groupKey: data.push.groupKey,
        sound: data.push.sound,
        lang: data.lang,
        additionalData: data.push.additionalData
    };
};

/**
 * Validate push notification data 
 * 
 */
const validatePush = async(data) => {
    if (data.hasOwnProperty('push')) {
        if (!data.push.hasOwnProperty('content')) {
            data.push.content = '';
        }
        if (!data.push.hasOwnProperty('send')) {
            data.sms.send = '';
        }
        if (!data.push.hasOwnProperty('sendVia')) {
            data.push.sendVia = '';
        }
        if (!data.push.hasOwnProperty('groupKey')) {
            data.push.groupKey = '';
        }
        if (!data.push.hasOwnProperty('additionalData')) {
            data.push.additionalData = {};
        }
        if (!data.push.hasOwnProperty('sound')) {
            data.push.sound = 'nil';
        }
    } else {
        data.push = {
            content: '',
            send: false,
            sendVia: '',
            groupKey: '',
            additionalData: ''
        };
    }
    return data;
};

module.exports = {
    validatePush,
    parsePushPayload
}