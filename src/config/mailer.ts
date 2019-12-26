import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmail = (from: string, to: string, subject: string, html: string) => {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from,
            subject,
            to,
            html
        }, (err, info) => {
            if (err) reject(err);
            resolve(info);
        });
    });
}
