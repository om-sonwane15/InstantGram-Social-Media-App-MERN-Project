const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sterling.harris@ethereal.email',
        pass: 'wEEnt7GbJvR2FDRxBJ'
    }
});

module.exports = transporter;
