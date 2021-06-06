/** Utils, other functions and Library imports */
const rp = require('request-promise');

/** Error Constants */
const Error = require('../errorConstants').ERROR;

/** Project Constants */
const DEFAULT_PAGINATION_LIMIT = 20;
const DEFAULT_PAGINATION_OFFSET = 0;

/**
 * Regex checkfor email 
 * 
 * @param value the parameter that was wrong
 * @param err the error code that occured
 * @param ideal the ideal value/condition for the parameter that was wrong
 */
const isValidEmail = (emails) => {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    let validEmails = []
    if (Array.isArray(emails)) {
        for (let i = 0; i < emails.length; i++) {
            if (reg.test(emails[i])) {
                validEmails.push(emails[i]);
            }
        }
        return validEmails;
    }
    return reg.test(emails);
};

const asyncMiddleware = exports.asyncMiddleware = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Generates an error based on the err type sent and the values
 * 
 * @param value the parameter that was wrong
 * @param err the error code that occured
 * @param ideal the ideal value/condition for the parameter that was wrong
 */
const stringConcatinator = (...arguments) => {
    let args = Array.prototype.slice.call(arguments);
    return args.join("");
}

/**
 * Error templater function to create dynamic errors from templated errors
 * 
 * @param {*} err Error string that needs to be tempalted
 * @param {*} template Tempalte object containing the keys and values to be replaced
 */
const errorTemplater = (err, template) => {
    for (let key in template) {
        err = err.replace(`{{${key}}}`, template[key])
    }
    return err
}

/**
 * Send slack message in case of error
 * 
 * @param slackURL webhook url for the slack app to publish to a channel
 * @param body of request with the error that triggered the function
 */
const sendSlack = async(slackURL, body) => {
    if (slackURL === "") {
        log(body);
        return false
    }
    let slackParam = {
        method: 'POST',
        uri: slackURL,
        body: { "text": JSON.stringify(body) },
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        await rp(slackParam);
        return true
    } catch (err) {
        log("Error Placed in slack: ", err);
        return false
    }
};

/**
 * Error handler hits when some error is there and it goes to next function
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler = async(err, req, res, next) => {
    try {
        if (err === 401) {
            res.sendStatus(401);
        } else {
            log("Error in errorHandler: ", err);
            let slackURL = req.body.config.slack.url || "";
            await sendSlack(slackURL, err);
            let response = {
                success: false,
                data: {},
                error: 'Something went wrong ' + JSON.stringify(err)
            };
            res.send(response)
        }
    } catch (err) {
        log("Sending error in slack: ", err);
        next(err);
    }
};

/**
 * Safely parse the data
 *
 * @param data
 * @returns {any}
 */
const parseSafe = (data) => {
    return JSON.parse(JSON.stringify(data));
};

/**
 * Logging module which will be built next hence shifting to logs
 * @param message
 */
const log = (...message) => {
    console.log(JSON.stringify(message));
};

/**
 * Check if data is empty
 *
 * @param data
 * @returns {boolean}
 */
const empty = (data) => {
    if (typeof(data) === 'number' || typeof(data) === 'boolean') {
        return false;
    }
    if (typeof(data) === 'undefined' || data === null) {
        return true;
    }
    if (typeof(data.length) !== 'undefined') {
        return data.length === 0;
    }
    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
};

/**
 * Send Json response
 *
 * @param {*} req
 * @param {*} res
 * @param {*} success
 * @param {*} data
 * @param {*} err
 */
const sendResponse = (req, res, success, data, err) => {
    return res.json({
        success,
        data,
        err: err
    })
};

/**
 * Send Class Response 
 *
 * @param {*} success
 * @param {*} data
 * @param {*} err
 */
const classResponse = (success, data, err) => {
    return {
        success,
        data,
        err: err
    }
};

const makeRequest = async(url, method, headers, body) => {
    let response = {
        success: true,
        data: {},
        err: ''
    };

    let params = {
        url: url,
        method: method,
        headers: headers,
        body: body,
        json: true
    };

    try {
        response.data = await rp(params);
    } catch (err) {
        response.success = false;
        response.err = err;
    }
    return response
};


module.exports = {
    isValidEmail: isValidEmail,
    asyncMiddleware: asyncMiddleware,
    errorHandler: errorHandler,
    parseSafe,
    log,
    sendResponse: sendResponse,
    makeRequest: makeRequest,
    classResponse: classResponse,
    empty,
    stringConcatinator,
    sendSlack,
    errorTemplater,

    DEFAULT_PAGINATION_LIMIT,
    DEFAULT_PAGINATION_OFFSET
};