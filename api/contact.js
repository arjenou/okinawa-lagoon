const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      'お問い合わせ項目': inquiryType,
      '氏名': name,
      'フリガナ': furigana,
      'メールアドレス': email,
      '住所': address,
      '電話番号': phone,
      '携帯番号': mobile,
      'お問い合わせ内容': message
    } = req.body;

    // 验证必填字段
    if (!inquiryType || !name || !email || !message) {
      return res.status(400).json({ 
        error: '必須項目が入力されていません',
        message: 'Please fill in all required fields'
      });
    }

    // 配置 Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // 邮件 HTML 模板
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .field {
      background: white;
      margin-bottom: 15px;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .field-label {
      font-weight: bold;
      color: #667eea;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .field-value {
      color: #333;
      font-size: 16px;
      word-wrap: break-word;
    }
    .message-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid #667eea;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛥️ 新しいお問い合わせ</h1>
    <p style="margin: 10px 0 0 0;">Okinawa Lagoon Yacht Charter</p>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="field-label">お問い合わせ項目</div>
      <div class="field-value">${inquiryType}</div>
    </div>

    <div class="field">
      <div class="field-label">氏名</div>
      <div class="field-value">${name}</div>
    </div>

    ${furigana ? `
    <div class="field">
      <div class="field-label">フリガナ</div>
      <div class="field-value">${furigana}</div>
    </div>
    ` : ''}

    <div class="field">
      <div class="field-label">メールアドレス</div>
      <div class="field-value"><a href="mailto:${email}">${email}</a></div>
    </div>

    ${address ? `
    <div class="field">
      <div class="field-label">住所</div>
      <div class="field-value">${address}</div>
    </div>
    ` : ''}

    ${phone ? `
    <div class="field">
      <div class="field-label">電話番号</div>
      <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
    </div>
    ` : ''}

    ${mobile ? `
    <div class="field">
      <div class="field-label">携帯番号</div>
      <div class="field-value"><a href="tel:${mobile}">${mobile}</a></div>
    </div>
    ` : ''}

    <div class="message-box">
      <div class="field-label">お問い合わせ内容</div>
      <div class="field-value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
    </div>

    <div class="footer">
      <p>このメールは Okinawa Lagoon のウェブサイトから送信されました</p>
      <p>返信する場合は、上記のメールアドレスに直接返信してください</p>
    </div>
  </div>
</body>
</html>
    `;

    // 发送邮件
    await transporter.sendMail({
      from: `"Okinawa Lagoon お問い合わせ" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email,
      subject: `【お問い合わせ】${inquiryType} - ${name}様`,
      html: emailHTML,
      text: `
お問い合わせ項目: ${inquiryType}
氏名: ${name}
${furigana ? `フリガナ: ${furigana}` : ''}
メールアドレス: ${email}
${address ? `住所: ${address}` : ''}
${phone ? `電話番号: ${phone}` : ''}
${mobile ? `携帯番号: ${mobile}` : ''}

お問い合わせ内容:
${message}
      `
    });

    // 返回成功响应
    return res.status(200).json({ 
      success: true,
      message: 'お問い合わせを受け付けました。ありがとうございます。'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'メールの送信に失敗しました',
      message: 'Failed to send email. Please try again later.'
    });
  }
};

