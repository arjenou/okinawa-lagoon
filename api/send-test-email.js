const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // SMTP 配置（与 contact.js 相同）
  const SMTP_USER = 'info@pasi.jp';
  const SMTP_PASSWORD = 'upyx dupq akzz xfnq';
  const RECIPIENT_EMAIL = 'info@pasi.jp';

  try {
    console.log('🔧 Testing SMTP connection...');
    
    // 配置 Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      }
    });

    console.log('📧 Verifying SMTP connection...');
    
    // 验证连接
    await transporter.verify();
    
    console.log('✅ SMTP connection verified!');
    console.log('📤 Sending test email...');

    // 发送测试邮件
    const info = await transporter.sendMail({
      from: `"PASI Test" <${SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: SMTP_USER,
      subject: '【テスト】API メール送信テスト',
      html: `
        <h1>🎉 成功！</h1>
        <p>このメールが届いていれば、SMTP 設定は正しく動作しています。</p>
        <p><strong>送信時刻：</strong> ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
        <hr>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
      `,
      text: `
テストメール送信成功！

このメールが届いていれば、SMTP 設定は正しく動作しています。
送信時刻: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

If you received this email, your SMTP configuration is working correctly!
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        messageId: info.messageId,
        from: SMTP_USER,
        to: RECIPIENT_EMAIL,
        timestamp: new Date().toISOString(),
        response: info.response
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        command: error.command
      }
    });
  }
};

