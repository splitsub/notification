/** Utils, other functions and Library imports */
const utils = require('../../../../../utils');

/** Class Files */
const Constants = require('../../../../classes/Template/Constants');

/** Error Constants */
const Error = require('../../../../../errorConstants').ERROR;


const requiredKeysChecker = async(data) => {
    for (let i = 0; i < Constants.createAttributes.length; i++) {
        if (!(Constants.createAttributes[i] in data)) {
            return utils.classResponse(false, {}, utils.errorTemplater(Error.required_template_property, { property: Constants.createAttributes[i] }));
        }
    }
    return utils.classResponse(true, {}, '');
}

module.exports = {
    requiredKeysChecker
}