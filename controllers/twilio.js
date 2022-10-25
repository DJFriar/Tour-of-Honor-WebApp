require('dotenv').config();
// const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = require('twilio')(accountSid, authToken);

function sendSMSMessage(destNumber, messageText) {
  const formattedNumber = `+1${destNumber.replace(/^(\+)|\D/g, '$1')}`;

  const smsMessage = {
    to: formattedNumber,
    from: fromNumber,
    body: messageText,
  };

  client.messages.create(smsMessage).then((message) => {
    console.log(`Message SID ${message.sid}`);
    return message.sid;
  });
}

exports.sendSMSMessage = sendSMSMessage;
