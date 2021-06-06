/** Utils, other functions and Library imports */
const utils = require("../../utils/utils");

/** Third Party Modules */
const sesTemplate = require("../../modules/email/ses/template/template");

/**
 * Create a new template
 * 
 * @param data information regarding the tempalte
 * @param awsConfig AWSConfiguration details
 * 
 */
const create = async(data, awsConfig, options = {}) => {
    let response = await sesTemplate.create(data, awsConfig);
    return utils.classResponse(response.success, response.data, response.err);
}

/**
 * Get a list of names of all existing templates
 * 
 * @param awsConfig AWSConfiguration details
 */
const get = async(awsConfig, options = {}) => {
    let response = await sesTemplate.get(awsConfig);
    return utils.classResponse(response.success, response.data, response.err);
}

/**
 * Get details of tempalte by its name
 * 
 * @param name Name of the template whose details are to be fetched
 * @param awsConfig AWSConfiguration details
 * 
 */
const getByName = async(name, awsConfig, options = {}) => {
    let response = await sesTemplate.getByName(name, awsConfig);
    return utils.classResponse(response.success, response.data, response.err);
}

/**
 * Upadate an existing template
 * 
 * @param data New details for the template that need to be updated
 * @param awsConfig AWSConfiguration details
 * 
 */
const updateByName = async(data, awsConfig, options = {}) => {
    let response = await sesTemplate.updateByName(data, awsConfig);
    return utils.classResponse(response.success, response.data, response.err);
}

/**
 * Delete a template by it's name
 * 
 * @param name Name of the template 
 * @param awsConfig AWSConfiguration details
 * 
 */
const deleteByName = async(name, awsConfig, options = {}) => {
    let response = await sesTemplate.deleteByName(name, awsConfig);
    return utils.classResponse(response.success, response.data, response.err);
}

module.exports = {
    create: create,
    get: get,
    updateByName: updateByName,
    deleteByName: deleteByName,
    getByName: getByName
};