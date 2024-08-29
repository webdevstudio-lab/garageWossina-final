const { EmailParams, Recipient } = require('mailersend');
const { mailerSend, sentFrom } = require('../../config/mailerSend.config');

const sendVerificationToken = async (email, username, verificationToken) => {
  const recipients = [new Recipient(`${email}`, `${username}`)];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject('VERIFICATION DU COMPTE')
    .setHtml(
      ` <!DOCTYPE html>
            <html lang="fr">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Votre Email de Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Verification de l'email</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p>Salut! ${username},</p>
                <p>Merci pour votre inscription! Votre code de verification est:</p>
                <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;"> ${verificationToken}</span>
                </div>
                <p>Saisissez ce code sur la page de vérification pour terminer votre inscription.</p>
                <p>Ce code expirera dans 10 minutes pour des raisons de sécurité.</p>
                <p>Si vous n'avez pas créé de compte chez nous, veuillez ignorer cet e-mail.</p>
                <p>Best regards,<br>Auth API Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
            </body>
            </html>
      `,
    )
    .setText(`Bonjour ${username} ceci est un mail officiel de Auth API Teams`);
  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.log(error);
    throw new error('Verifiation email sending Failed!');
  }
};

module.exports = sendVerificationToken;
