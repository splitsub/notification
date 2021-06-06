/** Utils, other functions and Library imports */
const utils = require('../../../utils/utils');
const _ = require('lodash');
const AWS = require('aws-sdk');

/** Error Constants */
const Error = require('../../../errorConstants').ERROR;




/**
 * Parses phone number and returns it with the country code prefixed
 * @param {*} phone Phone object containing the country code and the number
 */
const parsePhoneNumber = (phone) => {
    // Getting rid of a plus sign prefixed to the country code
    let cc = _.trim(phone.countryCode, '+');
    let number = phone.number;
    return cc + number;
}

/**
 * Update AWS configuration and create an SNS object
 * 
 * @param {*} reqConfig configuration for the request
 * 
 */
const configureSNS = async(reqConfig) => {
    let awsConfig = reqConfig.aws || {};
    await AWS.config.update({
        region: awsConfig.region,
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
    });

    let sns = new AWS.SNS();

    /** AWS-SDK does not send false or fall under catch when an error occurs
     *  If credentials are not present even then an object for SNS/SES is created
     *  with credentials/region set as null/undefined.
     */
    if ((sns.config.credentials === null) || (sns.config.region === undefined)) {
        return utils.classResponse(false, {}, Error.aws_config_error);
    }

    return utils.classResponse(true, sns, '');
}

module.exports = {
    parsePhoneNumber,
    configureSNS
}