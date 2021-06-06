/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');
const models = require('../../models/index');
const _ = require('lodash');

/** Class Files */
const Functions = require('./Functions');

/**
 * Get all the dumps present in notificationDump
 * @param data Contains all the query parameters and pagination to fetch the dumps
 */
const get = async(data) => {
    try {
        pagination = _.pick(data, ['limit', 'offset']);
        data = await Functions.whereParametersParser(data);
        let notificationDumps = await models.notificationDump.findAndCountAll({
            where: data,
            limit: pagination.limit || utils.DEFAULT_PAGINATION_LIMIT,
            offset: pagination.offset || utils.DEFAULT_PAGINATION_OFFSET
        });
        return utils.classResponse(true, notificationDumps, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Create new dump entry in the notification dump table
 * 
 * @param data Contains all the parameters for the dump
 */
const create = async(data) => {
    try {
        let newDump = await models.notificationDump.create(data);
        return utils.classResponse(true, newDump, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Delete Data dump entry by id
 * 
 * @param {*} id Id of the dump entry
 */
const deleteById = async(id) => {
    try {
        let deletedDump = await models.notificationDump.destroy({ where: { id: id } });
        return utils.classResponse(true, deletedDump, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Update data dump by id
 * 
 * @param data Contains all the parameters for the dump
 */
const updateById = async(data) => {
    try {
        let updatedDump = await models.notificationDump.update(data, { where: { id: data.id } });
        return utils.classResponse(true, updatedDump, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Get data dump by id
 * 
 * @param id Id of the dump
 */
const getById = async(id) => {
    try {
        let dump = await models.notificationDump.find({ where: { id: id } });
        return utils.classResponse(true, dump, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

module.exports = {
    get,
    create,
    updateById,
    deleteById,
    getById
}