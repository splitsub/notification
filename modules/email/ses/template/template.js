/** Utils, other functions and Library imports */
const AWS = require("aws-sdk");
const utils = require('../../../../utils/utils');
const functions = require('../functions');

/** Class Files */
const Error = require('../../../../errorConstants').ERROR;

/**
 * Returns parameter structure for a new template (If data is present, otherwise it sets it to empty string)
 * 
 * @param data Template details {html,subject,text,templatename}
 */
const getStructuredTemplateData = exports.getStructuredTemplateData = async(data) => {
    return {
        TemplateContent: {
            Html: data.html || '',
            Subject: data.subject || '',
            Text: data.text || ''
        },
        TemplateName: data.name || ''
    }
};



/**
 * Get template details by name
 * 
 * @param name of the template to fetch the details by
 * @param awsConfig AWSConfiguration details
 * 
 */
const getByName = async(name, awsConfig) => {
    let sesv2Data = await functions.configureSES(awsConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    let params = {
        TemplateName: name
    };

    try {
        const template = sesv2.getEmailTemplate(params).promise();
        return new Promise((resolve, reject) => {
            template
                .then(data => {
                    resolve(utils.classResponse(true, data, {}));
                })
                .catch(error => {
                    return reject(utils.classResponse(false, {}, error.message));
                })
        })
    } catch (err) {
        return classResponse(false, {}, Error.template_not_available_by_name);
    }
};

/**
 * Get all template
 * 
 * @param awsConfig AWSConfiguration details
 * 
 */
const get = async(awsConfig) => {
    let sesv2Data = await functions.configureSES(awsConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    try {
        const templates = sesv2.listEmailTemplates({}).promise();
        return new Promise((resolve, reject) => {
            templates
                .then(data => {
                    resolve(utils.classResponse(true, data, {}));
                })
                .catch(error => {
                    reject(utils.classResponse(false, {}, error.message));
                })
        })
    } catch (err) {
        return classResponse(false, {}, Error.template_list_not_available);
    }

};

/**
 * Update Existing template
 * 
 * @param data information regarding the template to be updated {html,subject,text,templatename}
 * @param awsConfig AWSConfiguration details
 * 
 */
const updateByName = async(data, awsConfig) => {
    let sesv2Data = await functions.configureSES(awsConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    let params = await getStructuredTemplateData(data);
    const updateEmailTemplate = sesv2.updateEmailTemplate(params).promise();
    return new Promise((resolve, reject) => {
        updateEmailTemplate
            .then(data => {
                resolve(utils.classResponse(true, data, {}))
            })
            .catch(error => {
                reject(utils.classResponse(false, {}, error.message));
            })
    });
};

/**
 * Delete Existing template
 * 
 * @param data contains the name for the template that has to be deleted
 * @param awsConfig AWSConfiguration details
 * 
 */
const deleteByName = async(name, awsConfig) => {
    let sesv2Data = await functions.configureSES(awsConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    let params = {
        TemplateName: name || ''
    };
    try {
        const deleteEmailTemplate = sesv2.deleteEmailTemplate(params).promise();
        return new Promise((resolve, reject) => {
            deleteEmailTemplate
                .then(data => {
                    resolve(utils.classResponse(true, data, {}))
                })
                .catch(error => {
                    reject(utils.classResponse(false, {}, error.message));
                })
        });
    } catch (error) {
        return utils.classResponse(false, {}, Error.template_not_removed);
    }
};

/**
 * Create a new template
 * 
 * @param data contains the information for the template that needs to be created {html,subject,text,templatename}
 * @param awsConfig AWSConfiguration details
 * 
 */
const create = async(data, awsConfig) => {
    let sesv2Data = await functions.configureSES(awsConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    let params = await getStructuredTemplateData(data);
    const createEmailTemplate = sesv2.createEmailTemplate(params).promise();
    return new Promise((resolve, reject) => {
        createEmailTemplate
            .then(data => {
                resolve(utils.classResponse(true, data, {}))
            })
            .catch(error => {
                reject(utils.classResponse(false, {}, error.message));
            })
    });
};

module.exports = {
    create: create,
    get: get,
    updateByName: updateByName,
    deleteByName: deleteByName,
    getByName: getByName
};