const { EmailParams, Recipient } = require('mailersend');
const { mailerSend, sentFrom } = require('../../config/mailerSend.config');

const sendResetPasswordToken = async (email, resteToken) => {
  const recipients = [new Recipient(`${email}`)];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject('RESET PASSWORD')
    .setHtml(
      ` <!DOCTYPE html>
        <html lang="fr">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p>Hello,</p>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
            <a href="${resteToken}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>Best regards,<br>Your App Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
        </body>
        </html>
      `,
    )
    .setText(`Bonjour ceci est un mail officiel de Auth API Teams`);
  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.log(error);
    throw new error('Verifiation email sending Failed!');
  }
};

module.exports = sendResetPasswordToken;
