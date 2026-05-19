const nodemailer = require('nodemailer');

const emailTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9fbfd;
            margin: 0;
            padding: 0;
            color: #1a2b49;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f6;
        }
        .header {
            background-color: #1a2b49;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            letter-spacing: 4px;
            font-weight: 300;
            text-transform: uppercase;
        }
        .header h1 span {
            color: #3aa89b;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
            font-size: 16px;
            color: #4a5568;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
        .otp-box {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #1a2b49;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MOONLIT<span>.</span></h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Moonlit - The Beauty Hub. All rights reserved.<br>
            If you did not request this email, please safely ignore it.
        </div>
    </div>
</body>
</html>
`;

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Moonlit" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.rawHtml ? options.message : emailTemplate(options.message, options.subject)
    };

    await transporter.sendMail(mailOptions);
};

sendEmail.template = emailTemplate;
module.exports = sendEmail;