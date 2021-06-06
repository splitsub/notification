/** Utils, other functions and Library imports */
const _ = require('lodash');
const utils = require('../utils/utils');

/** Class Files */
const Template = require('../classes/Template/Template');
const Constants = require('../classes/Template/Constants');
const Functions = require('../classes/Template/Functions');

/** Error Constants */
const Error = require('../errorConstants').ERROR;

/**
 * Get existing template by name
 * 
 * @param information regarding the tempalte
 */
const getByName = utils.asyncMiddleware(async(req, res, next) => {
    let name = req.params.name || '';
    let awsConfig = req.body.config || {};

    let validity = Functions.validateTemplateName(name);
    if (!validity.success) {
        return utils.sendResponse(req, res, validity.success, validity.data, validity.err);
    }

    let templateNameExists = await Functions.checkTempalteNameExistence(name, awsConfig);
    if (!templateNameExists) {
        return utils.sendResponse(req, res, false, {}, Error.template_name_exist_error);
    }

    let template = await Template.getByName(name, awsConfig);
    return utils.sendResponse(req, res, template.success, template.data, template.err);
});

/**
 * Get existing templates
 * 
 * @param information regarding the tempalte
 */
const get = utils.asyncMiddleware(async(req, res, next) => {
    let awsConfig = req.body.config || {};
    let templates = await Template.get(awsConfig);
    return utils.sendResponse(req, res, templates.success, templates.data, templates.err);
});

/**
 * Create a new template
 * 
 * @param information regarding the tempalte
 */
const create = utils.asyncMiddleware(async(req, res, next) => {
    let data = _.pick(req.body.data, Constants.createAttributes);
    let awsConfig = req.body.config || {};

    let validity = Functions.validateTemplateData(data);
    if (!validity.success) {
        return utils.sendResponse(req, res, validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(data.name, awsConfig);
    if (templateNameExists) {
        return utils.sendResponse(req, res, false, {}, Error.template_name_already_exists);
    }

    let newTemplate = await Template.create(data, awsConfig);
    return utils.sendResponse(req, res, newTemplate.success, newTemplate.data, newTemplate.err);
});

/**
 * Update an existing template
 * 
 * @param information regarding the tempalte
 */
const updateByName = utils.asyncMiddleware(async(req, res, next) => {
    let data = _.pick(req.body.data, Constants.createAttributes);
    let awsConfig = req.body.config || {};

    let validity = Functions.validateTemplateData(data);
    if (!validity.success) {
        return utils.sendResponse(req, res, validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(data.name, awsConfig);
    if (!templateNameExists) {
        return utils.sendResponse(req, res, false, {}, Error.template_name_exist_error);
    }
    let updatedTemplate = await Template.updateByName(data, awsConfig);
    return utils.sendResponse(req, res, updatedTemplate.success, updatedTemplate.data, updatedTemplate.err);
});

/**
 * Delete an existing template
 * 
 * @param information regarding the tempalte
 */
const deleteByName = utils.asyncMiddleware(async(req, res, next) => {
    let name = req.body.data.name || '';
    let awsConfig = req.body.config || {};

    let validity = Functions.validateTemplateName(name);
    if (!validity.success) {
        return utils.sendResponse(req, res, validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(name, awsConfig);
    if (!templateNameExists) {
        return utils.sendResponse(req, res, false, {}, Error.template_name_exist_error);
    }

    let deletedTemplate = await Template.deleteByName(name, awsConfig);
    return utils.sendResponse(req, res, deletedTemplate.success, deletedTemplate.data, deletedTemplate.err);
});

module.exports = {
    get: get,
    create: create,
    updateByName: updateByName,
    deleteByName: deleteByName,
    getByName: getByName
}