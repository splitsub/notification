/** Utils, other functions and Library imports */
const utils = require('../utils/utils');
const _ = require('lodash');

/** Class Files */
const NotificationDump = require('../classes/NotificationDump/NotificationDump');
const NotificationDumpConstants = require('../classes/NotificationDump/Constants');

/** Error Constants */
const Error = require('../errorConstants').ERROR;

/**
 * Get all dumps present in the DB
 */
const get = utils.asyncMiddleware(async(req, res, next) => {
    let request = req.params || {};
    let queryParameters = _.pick(request, NotificationDumpConstants.queryParameters);
    let dumps = await NotificationDump.get(queryParameters);
    return utils.sendResponse(req, res, dumps.success, dumps.data, dumps.err);
});

/**
 * Create new dump entry in the notification dump table after validating the type of the Notification dump
 * 
 */
const create = utils.asyncMiddleware(async(req, res, next) => {
    let request = req.body;
    let data = _.pick(request, NotificationDumpConstants.createAttributes);

    if (!(NotificationDumpConstants.TYPE_VALUES.includes(data.type))) {
        return utils.sendResponse(req, res, false, {}, Error.notification_dump_type_error);
    }
    for (let i = 0; i < NotificationDumpConstants.createAttributes; i++) {
        data[NotificationDumpConstants.createAttributes[i]] = JSON.stringify(data[NotificationDumpConstants.createAttributes[i]]);
    }

    let newDump = await NotificationDump.update(data);
    return utils.sendResponse(req, res, newDump.success, newDump.data, newDump.err);
});

/**
 * Update existing dump entry in the notification dump table after validating the type of the Notification dump
 * 
 */
const updateById = utils.asyncMiddleware(async(req, res, next) => {
    let request = req.body;
    let data = _.pick(request, NotificationDumpConstants.updateAttributes);

    if (!data.hasOwnProperty('id')) {
        return utils.classResponse(false, {}, Error.id_error);
    }
    let idExistence = await NotificationDump.getById(id);
    if (!idExistence.success) {
        return utils.classResponse(false, {}, Error.id_error);
    }
    if (!(NotificationDumpConstants.TYPE_VALUES.includes(data.type))) {
        return utils.sendResponse(req, res, false, {}, Error.notification_dump_type_error);
    }
    for (let i = 0; i < NotificationDumpConstants.updateAttributes; i++) {
        data[NotificationDumpConstants.updateAttributes[i]] = JSON.stringify(data[NotificationDumpConstants.updateAttributes[i]]);
    }

    let updatedDump = await NotificationDump.update(data);
    return utils.sendResponse(req, res, updatedDump.success, updatedDump.data, updatedDump.err);
});

/**
 * Delete a dump by ID
 */
const deleteById = utils.asyncMiddleware(async(req, res, next) => {
    let id = req.body.id || '';

    let idExistence = await NotificationDump.getById(id);
    if (!idExistence.success) {
        return utils.classResponse(false, {}, Error.id_error);
    }

    let deletedDump = await NotificationDump.deleteById(id);
    return utils.sendResponse(req, res, deletedDump.success, deletedDump.data, deletedDump.err);
});

/**
 * Get a dump by ID
 */
const getById = utils.asyncMiddleware(async(req, res, next) => {
    let id = req.body.id || '';
    let dump = await NotificationDump.getById(id);
    return utils.sendResponse(req, res, dump.success, dump.data, dump.err);
});

module.exports = {
    get,
    create,
    updateById,
    deleteById,
    getById
}