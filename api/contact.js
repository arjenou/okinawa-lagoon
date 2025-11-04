const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formType = req.body['formType'] || 'contact';
    
    let emailHTML, emailSubject, emailText;
    
    if (formType === 'reserve') {
      // 预约表单
      const {
        'プログラム名': programName,
        '乗船日': boardingDate,
        '宿泊日数': stayDays,
        '参加人数': members,
        '氏名': name,
        'フリガナ': furigana,
        '性別': gender,
        '生年月日': birthDate,
        '住所': address,
        '電話番号': phone,
        '携帯番号': mobile,
        'メールアドレス': email,
        '支払方法': paymentMethod,
        '備考': remarks
      } = req.body;
      
      // 验证必填字段
      if (!programName || !boardingDate || !stayDays || !members || !name || !email) {
        return res.status(400).json({ 
          error: '必須項目が入力されていません',
          message: 'Please fill in all required fields'
        });
      }
      
      emailSubject = `【予約申し込み】${programName} - ${name}様`;
      emailHTML = generateReserveEmailHTML(req.body);
      emailText = generateReserveEmailText(req.body);
      
    } else {
      // 联系表单
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
      
      emailSubject = `【お問い合わせ】${inquiryType} - ${name}様`;
      emailHTML = generateContactEmailHTML(req.body);
      emailText = generateContactEmailText(req.body);
    }

    // 获取发件人邮箱（用于 Reply-To）
    const userEmail = req.body['メールアドレス'];

    // 配置 Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // 发送邮件
    await transporter.sendMail({
      from: `"Okinawa Lagoon ${formType === 'reserve' ? '予約' : 'お問い合わせ'}" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: userEmail,
      subject: emailSubject,
      html: emailHTML,
      text: emailText
    });

    // 返回成功响应
    return res.status(200).json({ 
      success: true,
      message: formType === 'reserve' ? '予約申し込みを受け付けました。ありがとうございます。' : 'お問い合わせを受け付けました。ありがとうございます。'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'メールの送信に失敗しました',
      message: 'Failed to send email. Please try again later.'
    });
  }
};

// 生成联系表单邮件 HTML
function generateContactEmailHTML(data) {
  const {
    'お問い合わせ項目': inquiryType,
    '氏名': name,
    'フリガナ': furigana,
    'メールアドレス': email,
    '住所': address,
    '電話番号': phone,
    '携帯番号': mobile,
    'お問い合わせ内容': message
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { background: white; margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
    .field-label { font-weight: bold; color: #667eea; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .field-value { color: #333; font-size: 16px; word-wrap: break-word; }
    .message-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛥️ 新しいお問い合わせ</h1>
    <p style="margin: 10px 0 0 0;">Okinawa Lagoon Yacht Charter</p>
  </div>
  <div class="content">
    <div class="field"><div class="field-label">お問い合わせ項目</div><div class="field-value">${inquiryType}</div></div>
    <div class="field"><div class="field-label">氏名</div><div class="field-value">${name}</div></div>
    ${furigana ? `<div class="field"><div class="field-label">フリガナ</div><div class="field-value">${furigana}</div></div>` : ''}
    <div class="field"><div class="field-label">メールアドレス</div><div class="field-value"><a href="mailto:${email}">${email}</a></div></div>
    ${address ? `<div class="field"><div class="field-label">住所</div><div class="field-value">${address}</div></div>` : ''}
    ${phone ? `<div class="field"><div class="field-label">電話番号</div><div class="field-value"><a href="tel:${phone}">${phone}</a></div></div>` : ''}
    ${mobile ? `<div class="field"><div class="field-label">携帯番号</div><div class="field-value"><a href="tel:${mobile}">${mobile}</a></div></div>` : ''}
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
</html>`;
}

// 生成联系表单邮件纯文本
function generateContactEmailText(data) {
  const {
    'お問い合わせ項目': inquiryType,
    '氏名': name,
    'フリガナ': furigana,
    'メールアドレス': email,
    '住所': address,
    '電話番号': phone,
    '携帯番号': mobile,
    'お問い合わせ内容': message
  } = data;
  
  return `
お問い合わせ項目: ${inquiryType}
氏名: ${name}
${furigana ? `フリガナ: ${furigana}` : ''}
メールアドレス: ${email}
${address ? `住所: ${address}` : ''}
${phone ? `電話番号: ${phone}` : ''}
${mobile ? `携帯番号: ${mobile}` : ''}

お問い合わせ内容:
${message}
`;
}

// 生成预约表单邮件 HTML
function generateReserveEmailHTML(data) {
  const {
    'プログラム名': programName,
    '乗船日': boardingDate,
    '宿泊日数': stayDays,
    '参加人数': members,
    '氏名': name,
    'フリガナ': furigana,
    '性別': gender,
    '生年月日': birthDate,
    '住所': address,
    '電話番号': phone,
    '携帯番号': mobile,
    'メールアドレス': email,
    '支払方法': paymentMethod,
    '備考': remarks
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0698ba 0%, #0575a0 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .section-title { background: #0698ba; color: white; padding: 10px 15px; border-radius: 5px; margin: 20px 0 15px 0; font-weight: bold; }
    .field { background: white; margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 4px solid #0698ba; }
    .field-label { font-weight: bold; color: #0698ba; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .field-value { color: #333; font-size: 16px; word-wrap: break-word; }
    .remarks-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid #0698ba; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛥️ 新しい予約申し込み</h1>
    <p style="margin: 10px 0 0 0;">Okinawa Lagoon Yacht Charter</p>
  </div>
  <div class="content">
    <div class="section-title">◆ クルーズ希望日程</div>
    <div class="field"><div class="field-label">プログラム名</div><div class="field-value">${programName}</div></div>
    <div class="field"><div class="field-label">乗船日</div><div class="field-value">${boardingDate}</div></div>
    <div class="field"><div class="field-label">宿泊日数</div><div class="field-value">${stayDays}泊</div></div>
    <div class="field"><div class="field-label">参加人数</div><div class="field-value">${members}名</div></div>
    
    <div class="section-title">◆ 申込者様情報</div>
    <div class="field"><div class="field-label">氏名</div><div class="field-value">${name}</div></div>
    ${furigana ? `<div class="field"><div class="field-label">フリガナ</div><div class="field-value">${furigana}</div></div>` : ''}
    ${gender ? `<div class="field"><div class="field-label">性別</div><div class="field-value">${gender}</div></div>` : ''}
    ${birthDate ? `<div class="field"><div class="field-label">生年月日</div><div class="field-value">${birthDate}</div></div>` : ''}
    <div class="field"><div class="field-label">メールアドレス</div><div class="field-value"><a href="mailto:${email}">${email}</a></div></div>
    ${address ? `<div class="field"><div class="field-label">住所</div><div class="field-value">${address}</div></div>` : ''}
    ${phone ? `<div class="field"><div class="field-label">電話番号</div><div class="field-value"><a href="tel:${phone}">${phone}</a></div></div>` : ''}
    ${mobile ? `<div class="field"><div class="field-label">携帯番号</div><div class="field-value"><a href="tel:${mobile}">${mobile}</a></div></div>` : ''}
    
    ${paymentMethod ? `
    <div class="section-title">◆ お支払い方法</div>
    <div class="field"><div class="field-value">${paymentMethod}</div></div>
    ` : ''}
    
    ${remarks ? `
    <div class="section-title">◆ 備考</div>
    <div class="remarks-box">
      <div class="field-value" style="white-space: pre-wrap;">${remarks}</div>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>このメールは Okinawa Lagoon のウェブサイトから送信されました</p>
      <p>返信する場合は、上記のメールアドレスに直接返信してください</p>
    </div>
  </div>
</body>
</html>`;
}

// 生成预约表单邮件纯文本
function generateReserveEmailText(data) {
  const {
    'プログラム名': programName,
    '乗船日': boardingDate,
    '宿泊日数': stayDays,
    '参加人数': members,
    '氏名': name,
    'フリガナ': furigana,
    '性別': gender,
    '生年月日': birthDate,
    '住所': address,
    '電話番号': phone,
    '携帯番号': mobile,
    'メールアドレス': email,
    '支払方法': paymentMethod,
    '備考': remarks
  } = data;
  
  return `
◆ クルーズ希望日程
プログラム名: ${programName}
乗船日: ${boardingDate}
宿泊日数: ${stayDays}泊
参加人数: ${members}名

◆ 申込者様情報
氏名: ${name}
${furigana ? `フリガナ: ${furigana}` : ''}
${gender ? `性別: ${gender}` : ''}
${birthDate ? `生年月日: ${birthDate}` : ''}
メールアドレス: ${email}
${address ? `住所: ${address}` : ''}
${phone ? `電話番号: ${phone}` : ''}
${mobile ? `携帯番号: ${mobile}` : ''}

${paymentMethod ? `◆ お支払い方法\n${paymentMethod}\n` : ''}
${remarks ? `◆ 備考\n${remarks}` : ''}
`;
}