
let data = {
    "users": {
        "phone": [
            {
                "number": "9873000969",
                "countryCode": "+91"
            }
        ],
        "email": [
            {
                "emailAddress": "sharaisunny@gmail.com",
                "replacementData": "{heading:'Welcome to Splitsub',username:'Shrey',name:'Shrey',message:'We are happy to have you join the Splitsub family. Use Splitsub to save almost 80% on your monthly subscription costs. Share with your family, friends or with the whole Splitsub family. Happy Sharing',playStoreUrl:'https://play.google.com/store/apps/details?id=org.teqop.Splitsub&hl=en_IN&gl=US',appStoreUrl:'https://apps.apple.com/in/app/splitsub/id1476910943',unsubscribeUrl:'xyz'}"
            },
            {
                "emailAddress": "vishalsharai@gmail.com",
                "replacementData": "{heading:'Welcome to Splitsub',username:'Vishal',name:'Vishal',message:'We are happy to have you join the Splitsub family. Use Splitsub to save almost 80% on your monthly subscription costs. Share with your family, friends or with the whole Splitsub family. Happy Sharing',playStoreUrl:'https://play.google.com/store/apps/details?id=org.teqop.Splitsub&hl=en_IN&gl=US',appStoreUrl:'https://apps.apple.com/in/app/splitsub/id1476910943',unsubscribeUrl:'xyz'}"
            }
        ]
    },
    "sms": {
        "content": "Hello Sir your plasma is ready",
        "sendVia": "aws_sns",
        "send": true
    },
    "email": {
        "send": true,
        "sendVia": "aws_ses",
        "template": {
            "templateName": "newUserTest",
            "defaultData": ""
        },
        "fileUrl": "",
        "fileBase64": ""
    },
    "config": {
        "aws": {
            "accessKeyId": "AKIA56FFCWV4YJI4XDCM",
            "secretAccessKey": "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",
            "region": "eu-west-1"
        },
        "sms": {
            "senderId": "TESTAC"
        },
        "email": {
            "senderId": "info@splitsub.com",
            "subject": "Testing the API For the Second"
        },
        "slack": {
            "url": "https://hooks.slack.com/services/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"
        }
    }
}

let Notification = require('../index');

const x = () => {
    Notification.sendNotification(data)
        .then(data => console.log(JSON.stringify(data, null, 4)))
        .catch(err => console.log(err));
    Notification.template.get(data).then(data => console.log(JSON.stringify(data, null, 4)));
}
x()