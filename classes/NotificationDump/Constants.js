/** Constants for type of notification dump */
const TYPE_EMAIL = 'email';
const TYPE_PUSH = 'push';
const TYPE_SMS = 'sms';
const TYPE_CALL = 'call';
const TYPE_VALUES = [TYPE_EMAIL, TYPE_PUSH, TYPE_SMS, TYPE_CALL];

const createAttributes = ["config", "request", "type", "response", "clientSlug"];
const updateAttributes = ["id", "config", "request", "type", "response", "clientSlug"];
const queryParameters = ["id", "config", "request", "type", "response", "clientSlug", "startDate", "endDate", "pagination"]

module.exports = {
    TYPE_EMAIL,
    TYPE_PUSH,
    TYPE_SMS,
    TYPE_VALUES,

    createAttributes,
    updateAttributes,
    queryParameters
}