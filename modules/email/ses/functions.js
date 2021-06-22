/** Utils, other functions and Library imports */
const utils = require("../../../utils/utils");
const AWS = require("aws-sdk");

/** Error Constants */
const Error = require('../../../errorConstants').ERROR;

/**
 * Update AWS configuration and create an SES object
 * 
 * @param {*} reqConfig configuration for the request
 * 
 */
const configureSES = async (reqConfig) => {
    let awsConfig = reqConfig.aws || {};
    await AWS.config.update({
        region: awsConfig.region,
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
    });

    let sesv2 = new AWS.SESV2();

    /** AWS-SDK does not send false or fall under catch when an error occurs
     *  If credentials are not present even then an object for SNS/SES is created
     *  with credentials/region set as null/undefined.
     */
    if ((sesv2.config.credentials === null) || (sesv2.config.region === undefined)) {
        return utils.classResponse(false, {}, Error.aws_config_error);
    }

    return utils.classResponse(true, sesv2, '');
}

/**
 * Send non bulk emails using AWS SES sendEmail function
 * Sends a single mail with content types: 
 * - Raw ( base64 encoded email with attachment capabilities )
 * - Simple ( Email with only HTMl Content )
 * - Template ( Email with an existing template )
 * 
 * @param {*} emailParams configuration for the request
 * @returns any error that has taken place otherwise the messageID of the email that has been sent 
 */
const sendNonBulkEmail = async (emailParams, reqConfig) => {
    let sesv2Data = await configureSES(reqConfig);
    if (!sesv2Data.success) {
        return sesv2Data;
    }
    const sesv2 = sesv2Data.data;

    /**
     * AWS-SESV2 sendEmail
     * For details of the possible errors and success messages please scroll down to the parameters.
     * Documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#sendEmail-property
     * 
     * The Function returns an AWS response object. 
     * Response Object: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Response.html
     */
    try {
        const sendEmail = await sesv2.sendEmail(emailParams).promise();
        return utils.classResponse(true, sendEmail, '');
    } catch (err) {
        return utils.classResponse(false, {}, err);
    }
}

/**
 * Parse email emailAddresses based on the data type that has been send
 * If an email object is sent then extract the emailAddress parameter otherwise check validity
 * and push it into the final array. Do this for all the emailAddresses(including cc and bcc)
 * 
 * @param data Contains user data for the emails
 */
const emailAddressParser = async (data) => {
    let toAddresses = [];
    for (let i = 0; i < data.email.length; i++) {
        if ((typeof data.email[i] === 'object' && !utils.isValidEmail(data.email[i].emailAddress)) || (!utils.isValidEmail(data.email[i]))) {
            continue
        }
        toAddresses.push(data.email[i]);
    }

    let ccAddresses = utils.isValidEmail(data.cc) || [];
    let bccAddresses = utils.isValidEmail(data.bcc) || [];
    return utils.classResponse(true, {
        BccAddresses: ccAddresses,
        CcAddresses: bccAddresses,
        ToAddresses: toAddresses
    }, '');
}

/**
 * Parse data parameters for a simple email
 * 
 * @param data Contains data for the email
 * @param reqConfig Contains config information for the email
 */
const parseSimpleEmail = async (data, reqConfig) => {
    let emailAddresses = await emailAddressParser(data.users);
    if (!emailAddresses.success) {
        return emailAddresses
    }

    return {
        Content: {
            Simple: {
                Body: {
                    Html: {
                        Data: data.email.content || ""
                    },
                    Text: {
                        Data: data.email.content || ""
                    }
                },
                Subject: {
                    Data: reqConfig.email.subject || ""
                }
            }
        },
        Destination: emailAddresses.data || {},
        FromEmailAddress: reqConfig.email.senderId || ""
    }
}

/**
 * Parse data for bulk emails
 * 
 * @param data Contains data for the email
 * @param reqConfig Contains config information for the email
 */
const parseBulkEmail = async (data, reqConfig) => {
    let emailAddresses = await emailAddressParser(data.users);
    if (!emailAddresses.success) {
        return emailAddresses
    }

    let bulkEntries = [];
    let sendToEmails = [];
    for (let i = 0; i < emailAddresses.data.ToAddresses.length; i++) {
        if (typeof (emailAddresses.data.ToAddresses[i]) === 'string') {
            sendToEmails = [emailAddresses.data.ToAddresses[i]]
        } else {
            sendToEmails = [emailAddresses.data.ToAddresses[i].emailAddress]
        }
        let entry = {
            Destination: { /* required */
                BccAddresses: emailAddresses.data.BccAddresses || [],
                CcAddresses: emailAddresses.data.CcAddresses || [],
                ToAddresses: sendToEmails || []
            },
            ReplacementEmailContent: {
                ReplacementTemplate: {
                    ReplacementTemplateData: emailAddresses.data.ToAddresses[i].replacementData || "{}"
                }
            }
        }
        bulkEntries.push(entry);
    }
    return {
        BulkEmailEntries: bulkEntries || [],
        DefaultContent: {
            Template: {
                TemplateData: data.email.template.defaultData || '{}',
                TemplateName: data.email.template.templateName || ''
            }
        },
        FromEmailAddress: reqConfig.email.senderId || ''
    }
}

/**
 * Parse data for raw email
 * Raw emails are the only way to send attachments on AWS-SESV2
 * For more information: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-raw.html
 * 
 * @param data Contains data for the email
 * @param reqConfig Contains config information for the email
 */
const parseRawEmail = async (data, reqConfig) => {
    let emailAddresses = await emailAddressParser(data.users);
    if (!emailAddresses.success) {
        return emailAddresses
    }

    /** If there are CC and BCC emails then join them and create their string
     *  Otherwise set them to '---' so that they can be replaced
     *  This is done because even a space or \n at the wrong place stops the email servers from parsing the email 
     */
    let bccEmailsString = emailAddresses.data.BccAddresses.length > 0 ? `Bcc:${emailAddresses.data.BccAddresses.join()}` : "---";
    let ccEmailsString = emailAddresses.data.CcAddresses.length > 0 ? `Cc:${emailAddresses.data.CcAddresses.join()}` : "---"

    let emailData = `From:<${reqConfig.email.senderId || ""}>
    To:${emailAddresses.data.ToAddresses.join()}
    ${bccEmailsString}
    ${ccEmailsString}
    Subject: ${reqConfig.email.subject || ""}
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary=\"NextPart\"\n
    --NextPart
    Content-Type: text/html\n\n${data.email.content || "Content"}\n
    --NextPart
    Content-Type: application/octet-stream; name="${data.email.fileName || ""}"
    Content-Transfer-Encoding: base64 \nContent-Disposition: attachment\n
    ${data.email.fileBase64.toString("base64").replace(/([^\0]{76})/g, "$1\n") || ""}\n
    --NextPart--`;

    /** The code below is to replace the cc and bcc string explained above and the tab / 4 spaces created by
     *  The editor to make the above emailData look indented. 
     *  This is done because even a space or \n or \t at the wrong place stops the email servers from parsing the email
     */
    emailData = emailData.replace(/\n    ---/g, "").replace(/    /g, "").replace(/\t/g, "");

    return {
        Content: {
            Raw: {
                Data: emailData
            }
        },
        Destination: emailAddresses.data || {},
        FromEmailAddress: reqConfig.email.senderId || ""
    }
}

/**
 * Get the type of email: i.e. bulk, simple or raw
 * 
 * @param params contains the parameters for the email
 */
const getSendMethod = async (data) => {
    if ((data.fileURL.length > 0 || data.fileBase64.length > 0) && data.fileName.length > 0) {
        return "raw";
    } else if (data.hasOwnProperty('template') && data.template.templateName !== "") {
        return "bulk";
    } else {
        return "simple"
    }
}

module.exports = {
    parseSimpleEmail,
    parseBulkEmail,
    getSendMethod,
    parseRawEmail,
    configureSES,
    sendNonBulkEmail
}