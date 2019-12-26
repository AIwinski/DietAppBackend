"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
exports.sendEmail = (from, to, subject, html) => {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from,
            subject,
            to,
            html
        }, (err, info) => {
            if (err)
                reject(err);
            resolve(info);
        });
    });
};
//# sourceMappingURL=mailer.js.map