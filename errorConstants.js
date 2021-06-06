const ERROR = {
    "template_list_not_available": " Could not get tempaltes list from SES ",
    "template_not_removed": " Could not delete template from SES ",
    "template_not_available_by_name": " Could not get tempalte from SES ",
    "unable_to_send_mail": " Could not send email using SESV2 ",
    "template_name_error": " Tempalte name can only contain alphanumeric character and underscore with no spaces ",
    "template_type_error": "{{parameter}} parameter sent is of invalid type, please send {{type}}",
    "template_name_exist_error": " The template name does not exist",
    "template_name_already_exists": " The template with this name already exists ",
    "required_template_property": "{{property}} required property for a template was not sent",
    "invalid_argument_error": " is an invalid argument it should be one of: ",
    "send_via_error": "Invalid service name sent in send via.",
    "check_request_data": "Email type could not be found please check the request data",
    "aws_config_error": "The AWS config sent was incorrect",
    "invalid_data_error": "The data sent was found to be invalid",
    "invalid_to_addresses": "The to addresses sent are invalid.",
    "sms_message_limit_error": "The message length was larger than the allowed limit",
    "db_operation_error": "The DB could not perfrom the operation",
    "db_entry_not_found": "Could not find the given ID in the database",
    "id_error": "The ID sent was found to be invalid",
    "slack_error": "Inavlid Slack URL: empty",
    "required_object_error": "{{object}} is required and wasn't sent",
    "required_attribute_error": "{{attribute}} is required and wasn't sent",
    "users_limit_error": "The number of users sent was higher than allowed",
    "msg91_config_error": "The MSG91 config was not found",
    "onesignal_config_error": "The OneSignal Config was not found",
    "config_error": "The Configuration sent was found to be invalid"
}

module.exports = {
    ERROR: ERROR
}