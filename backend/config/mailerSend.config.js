const { MailerSend, Sender } = require('mailersend');
const dotenv = require('dotenv');
dotenv.config();

const mailerSend = new MailerSend({
  apiKey: process.env.SENDEMAIL_API_KEY,
});

const sentFrom = new Sender(
  'MS_TbtB09@trial-351ndgw9vrd4zqx8.mlsender.net',
  'Auth API',
);

module.exports = { mailerSend, sentFrom };
