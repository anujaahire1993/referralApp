import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerService = {
    signUpEmailTemplate: async (emailParam) => {
        console.log(process.env.MAILERSEND_API_KEY);
        console.log(emailParam);

        const mailerSend = new MailerSend({
            apiKey: process.env.MAILERSEND_API_KEY,
        });

        const sentFrom = new Sender(emailParam.senderEmail, emailParam.senderName);

        const recipients = [
            new Recipient(emailParam.recipientEmail, emailParam.recipientName)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("Welcome")
            .setTemplateId(emailParam.templateId)
            .setPersonalization(emailParam.personalization);
        try {
            await mailerSend.email.send(emailParams);
        } catch (error) {
            // Handle the error here
            console.error('Error:', error);
        }

    },
};

export default mailerService;
