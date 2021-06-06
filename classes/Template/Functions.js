/** Utils, other functions and Library imports */
const utils = require('../../utils/utils');

/** Class Files */
const Template = require('./Template');
const Constants = require('./Constants');

/** Error Constants */
const Error = require('../../errorConstants').ERROR;

/**
 * Check if template with the name exists
 * 
 * @param name of the template that needs to be checked
 */
const checkTempalteNameExistence = async(name, awsConfig) => {
    try {
        let templateName = await Template.getByName(name, awsConfig);
        return templateName.success;
    } catch (err) {
        return false;
    }
}

/**
 * Validates tempalte data
 * 
 * @param data of the template that needs to be validated {'name', 'html', 'subject', 'text'}
 */
const validateTemplateData = (data) => {
    try {
        let validName = validateTemplateName(data.name);
        if (!validName.success) {
            return validName;
        }
        for (let key in data) {
            if (typeof(data[key]) !== 'string') {
                return utils.classResponse(false, {}, utils.errorTemplater(Error.template_type_error, { parameter: key, type: 'string' }));
            }
        }
        for (let i = 0; i < Constants.createAttributes.length; i++) {
            if (!(Constants.createAttributes[i] in data)) {
                return utils.classResponse(false, {}, Error.required_template_property);
            }
        }
        return utils.classResponse(true, {}, '');
    } catch {
        return utils.classResponse(false, {}, Error.invalid_data_error);
    }
}

/**
 * Validate template name
 * 
 * @param  name of the template that needs to be validated
 */
const validateTemplateName = (name) => {
    let regexp = /^[a-zA-Z0-9_]+$/;
    if (name.search(regexp) === -1 || typeof(name) !== 'string') {
        return utils.classResponse(false, {}, Error.template_name_error);
    }
    return utils.classResponse(true, {}, '')
}

module.exports = {
    validateTemplateData: validateTemplateData,
    validateTemplateName: validateTemplateName,
    checkTempalteNameExistence: checkTempalteNameExistence
}