require('dotenv').config();
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const client = require('twilio')(accountSid, authToken);

function sendSMSMessage(destNumber) {
  console.log("==== sendSMSMessage() called ====");

  const smsMessage = {
    to: destNumber,
    from: fromNumber,
    body: 'Test SMS from TOH!',
  };

  client.messages
  .create(smsMessage)
  .then((message) => {
    console.log(`Message SID ${message.sid}`);
    return message.sid;
  });
};

exports.sendSMSMessage = sendSMSMessage;