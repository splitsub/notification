/**
 * Validate incoming data for the email
 *
 * @param data payload of the incoming request
 * @return validated data 
 */
const validateEmailPayload = async(data, reqConfig) => {
    if (data.hasOwnProperty('users')) {
        if (data.users.hasOwnProperty('email')) {
            if (!Array.isArray(data.users.email)) {
                data.users.email = [data.users.email];
            }
        }
        if (!(data.users.hasOwnProperty('cc'))) {
            data.users.cc = [];
        }
        if (!(data.users.hasOwnProperty('bcc'))) {
            data.users.bcc = [];
        }
        if (!(data.users.hasOwnProperty('email'))) {
            data.users.email = [];
        }
    } else {
        data.users = {
            email: [],
            cc: [],
            bcc: []
        };
    }
    if (reqConfig.hasOwnProperty('email')) {
        if (!reqConfig.email.hasOwnProperty('senderId')) {
            reqConfig.email.senderId = '';
        }
        if (!reqConfig.email.hasOwnProperty('subject')) {
            reqConfig.email.subject = '';
        }
    } else {
        reqConfig.email = {
            senderId: '',
            subject: ''
        }
    }
    return {
        data: data,
        reqConfig: reqConfig
    };
}

module.exports = {
    validateEmailPayload: validateEmailPayload
}