/** Utils, other functions and Library imports */
const { Expo } = require('expo-server-sdk')

/**
 * Send Push notification to Users using Expo
 * 
 * @param {*} data User data and the content of the push notification
 * @param {*} reqConfig Contains configuration for expo
 */
exports.androidHelper = async(data, reqConfig) => {
    let response = {
        success: true,
        data: {},
        error: ''
    };
    // Create a new Expo SDK client
    let expo = new Expo()
    let somePushTokens = data.expoToken;
    let content = data.content;
    let sound = data.sound || 'default'

    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of somePushTokens) {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            response.success = false
            response.error = `Push token ${pushToken} is not a valid Expo push token`
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: sound,
            body: content,
        })
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async() => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                response.success = false
                response.error = error
            }
        }
    })();
    return utils.classResponse(true, response, '');
};