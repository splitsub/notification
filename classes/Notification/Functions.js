/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');
const moment = require('moment');


/** Class Files */
const Email = require('../Email/Email');
const SMS = require('../SMS/SMS');
const Push = require('../Push/Push');

/**
 * Exact payload verification i.e. which has to enter our server
 * eg: any missing keys, values should be exactly of same type
 * 1. phone number should be length 10
 * 2. email with email verification function
 *
 */
const validation = async(data) => {
    if (data.hasOwnProperty('users')) {
        if (data.users.hasOwnProperty('id')) {
            if (!Array.isArray(data.users.id)) {
                data.users.id = [data.users.id];
            }
        } else {
            data.users.id = [];
        }
        if (data.users.hasOwnProperty('phone')) {
            if (!Array.isArray(data.users.phone)) {
                data.users.phone = [data.users.phone];
            } else {
                for (let i = 0; i < data.users.phone.length; i++) {
                    if (!data.users.phone[i].hasOwnProperty('number') || !data.users.phone[i].hasOwnProperty('countryCode')) {
                        data.users.phone[i].number = '';
                        data.users.phone[i].countryCode = '';
                    }
                }
            }
        } else {
            data.users.phone = [];
        }
    } else {
        data.users = {
            phone: [{
                number: '',
                countryCode: ''
            }],
            id: []
        };
    }
    if (data.hasOwnProperty('sendAt')) {
        if (!data.sendAt.hasOwnProperty('now')) {
            data.sendAt.now = '';
        }
        if (!data.sendAt.hasOwnProperty('later')) {
            data.sendAt.later = '';
        }
    } else {
        data.sendAt = {
            now: '',
            later: ''
        };
    }
    if (data.hasOwnProperty('sms')) {
        if (!data.sms.hasOwnProperty('content')) {
            data.sms.content = '';
        }
        if (!data.sms.hasOwnProperty('send')) {
            data.sms.send = false;
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
    if (data.hasOwnProperty('call')) {
        if (!data.call.hasOwnProperty('content')) {
            data.call.content = '';
        }
        if (!data.call.hasOwnProperty('send')) {
            data.call.send = false;
        }
        if (!data.call.hasOwnProperty('sendVia')) {
            data.call.sendVia = '';
        }
        if (!data.call.hasOwnProperty('otp')) {
            data.call.otp = false;
        }
    } else {
        data.call = {
            content: '',
            send: false,
            sendVia: '',
            otp: false,
        };
    }
    if (data.hasOwnProperty('push')) {
        if (!data.push.hasOwnProperty('content')) {
            data.push.content = '';
        }
        if (!data.push.hasOwnProperty('send')) {
            data.sms.send = false;
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
    if (data.hasOwnProperty('email')) {
        if (!data.email.hasOwnProperty('content')) {
            data.email.content = '';
        }
        if (!data.email.hasOwnProperty('send')) {
            data.email.send = false;
        }
        if (!data.email.hasOwnProperty('sendVia')) {
            data.email.sendVia = '';
        }
        if (!data.email.hasOwnProperty('template')) {
            data.email.template = {
                templateName: "",
                defaultData: "{}"
            };
        }
        if (!data.email.hasOwnProperty('fileName')) {
            data.email.fileName = ""
        }
        if (!data.email.hasOwnProperty('fileURL')) {
            data.email.fileURL = ""
        }
        if (!data.email.hasOwnProperty('fileBase64')) {
            data.email.fileBase64 = ""
        }
    } else {
        data.email = {
            content: '',
            send: false,
            sendVia: '',
            template: {
                templateName: "",
                defaultData: "{}"
            },
            fileName: "",
            fileURL: "",
            fileBase64: ""
        };
    }
    if (data.hasOwnProperty('lang')) {
        if (!data.lang.hasOwnProperty('from')) {
            data.lang.from = '';
        }
        if (!data.lang.hasOwnProperty('to')) {
            data.lang.to = '';
        }
        if (!data.lang.hasOwnProperty('translate')) {
            data.lang.translate = '';
        }
        if (!data.lang.hasOwnProperty('translateVia')) {
            data.lang.translateVia = '';
        }
    } else {
        data.lang = {
            from: '',
            to: '',
            translate: '',
            translateVia: ''
        };
    }
    return data;
};

/**
 * Parse incoming payload with sendAt key
 *
 * @param sendAt payload of incoming request
 * @return timestamp    only timestamp when notif has to be send
 */
const parseSendAtPayload = (sendAt) => {
    let date = moment();
    if (sendAt.now === false) {
        date = moment.format(sendAt.later)
    }

    return date.unix();
};

module.exports = {
    validation
};