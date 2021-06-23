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
const getByName = async (body) => {
    let name = body.data.name;
    let awsConfig = body.config || {};

    let validity = Functions.validateTemplateName(name);
    if (!validity.success) {
        return utils.classResponse(validity.success, validity.data, validity.err);
    }

    let templateNameExists = await Functions.checkTempalteNameExistence(name, awsConfig);
    if (!templateNameExists) {
        return utils.classResponse(false, {}, Error.template_name_exist_error);
    }

    let template = await Template.getByName(name, awsConfig);
    return utils.classResponse(template.success, template.data, template.err);
};

/**
 * Get existing templates
 * 
 * @param information regarding the tempalte
 */
const get = async (body) => {
    let awsConfig = body.config || {};
    let templates = await Template.get(awsConfig);
    return utils.classResponse(templates.success, templates.data, templates.err);
};

/**
 * Create a new template
 * 
 * @param information regarding the tempalte
 */
const create = async (body) => {
    let data = _.pick(body.data, Constants.createAttributes);
    let awsConfig = body.config || {};

    let validity = Functions.validateTemplateData(data);
    if (!validity.success) {
        return utils.classResponse(validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(data.name, awsConfig);
    if (templateNameExists) {
        return utils.classResponse(false, {}, Error.template_name_already_exists);
    }

    let newTemplate = await Template.create(data, awsConfig);
    return utils.classResponse(newTemplate.success, newTemplate.data, newTemplate.err);
};

/**
 * Update an existing template
 * 
 * @param information regarding the tempalte
 */
const updateByName = async (body) => {
    let data = _.pick(body.data, Constants.createAttributes);
    let awsConfig = body.config || {};

    let validity = Functions.validateTemplateData(data);
    if (!validity.success) {
        return utils.classResponse(validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(data.name, awsConfig);
    if (!templateNameExists) {
        return utils.classResponse(false, {}, Error.template_name_exist_error);
    }
    let updatedTemplate = await Template.updateByName(data, awsConfig);
    return utils.classResponse(updatedTemplate.success, updatedTemplate.data, updatedTemplate.err);
};

/**
 * Delete an existing template
 * 
 * @param information regarding the tempalte
 */
const deleteByName = async (body) => {
    let name = body.data.name || '';
    let awsConfig = body.config || {};

    let validity = Functions.validateTemplateName(name);
    if (!validity.success) {
        return utils.classResponse(validity.success, validity.data, validity.err);
    }
    let templateNameExists = await Functions.checkTempalteNameExistence(name, awsConfig);
    if (!templateNameExists) {
        return utils.classResponse(false, {}, Error.template_name_exist_error);
    }

    let deletedTemplate = await Template.deleteByName(name, awsConfig);
    return utils.classResponse(deletedTemplate.success, deletedTemplate.data, deletedTemplate.err);
};

module.exports = {
    get,
    create,
    updateByName,
    deleteByName,
    getByName
}
