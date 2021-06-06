/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');
const moment = require('moment');
const { Op } = require('sequelize');
const _ = require('lodash');

/** Class Files */
const NotificationDump = require('./NotificationDump');
const Constants = require('./Constants');

/**
 * 
 * @param {*} data Parameters to be passed into the get Query
 */
const whereParametersParser = async(data) => {
    /** Picks all the attributes that are possible for a search query in sequelize */
    let whereParams = _.pick(data, Constants.updateAttributes);

    /** Checking if a startDate or endDate has been sent to query the createdAt field */
    if (data.hasOwnProperty('startDate')) {
        let now = moment().format('YYYY-MM-DD');
        let endDate = data.endDate || now;
        whereParams.createdAt = {
            [Op.between]: [data.startDate, endDate]
        }
    }

    return whereParams
}

/**
 * Create a data object from parameters being sent when called locally.
 * 
 * @param {*} config of the incoming request
 * @param {*} request Contains the data part of the request, with the notification details
 * @param {*} type type of notification to be logged 
 * @param {*} response Response that was send by the function
 * @param {*} clientSlug Name of the client 
 * @param {*} success Flag for successful execution
 */
const postNotificationDump = async(config, request, type, response, clientSlug) => {
    let newDump = await NotificationDump.create({
        config: JSON.stringify(config) || "",
        request: JSON.stringify(request) || "",
        type: JSON.stringify(type) || "",
        response: JSON.stringify(response) || "",
        clientSlug: JSON.stringify(clientSlug) || ""
    });
    return utils.classResponse(newDump.success, newDump.data, newDump.err);
}

module.exports = {
    postNotificationDump,
    whereParametersParser
}