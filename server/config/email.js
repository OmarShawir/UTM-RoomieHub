const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:       process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:       Number(process.env.EMAIL_PORT) || 587,
  secure:     false,   // Use STARTTLS (not SSL)
  requireTLS: true,    // Force TLS upgrade
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certs in dev
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from:     `"UTM RoomieHub" <${process.env.EMAIL_USER}>`,
    replyTo:  process.env.EMAIL_USER,
    to,
    subject,
    html,
    headers: {
      'X-Priority': '1',
      'X-Mailer': 'UTM RoomieHub Mailer',
    },
  });
};

module.exports = { sendEmail };
