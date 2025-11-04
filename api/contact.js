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

    // SMTP 配置（硬编码）
    const SMTP_USER = 'info@pasi.jp';
    const SMTP_PASSWORD = 'upyx dupq akzz xfnq';
    const RECIPIENT_EMAIL = 'info@pasi.jp';

    // 配置 Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      }
    });

    // 发送邮件到 info@pasi.jp
    await transporter.sendMail({
      from: `"Okinawa Lagoon ${formType === 'reserve' ? '予約' : 'お問い合わせ'}" <${SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: userEmail,
      subject: emailSubject,
      html: emailHTML,
      text: emailText
    });

    // 发送自动回复邮件给用户
    const language = req.body['language'] || 'JP';
    const autoReplySubject = getAutoReplySubject(language, formType);
    const autoReplyHTML = generateAutoReplyHTML(req.body, language);
    const autoReplyText = generateAutoReplyText(req.body, language);

    await transporter.sendMail({
      from: `"PASI" <${SMTP_USER}>`,
      to: userEmail,
      subject: autoReplySubject,
      html: autoReplyHTML,
      text: autoReplyText
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
    <p style="margin: 10px 0 0 0;">PASI</p>
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
    <p style="margin: 10px 0 0 0;">PASI</p>
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

// ===== 自动回复邮件功能 =====

// 获取自动回复邮件主题
function getAutoReplySubject(language, formType) {
  const subjects = {
    JP: formType === 'reserve' ? '【PASI】予約申し込みを受け付けました' : '【PASI】お問い合わせを受け付けました',
    EN: formType === 'reserve' ? '[PASI] Booking Confirmation' : '[PASI] Inquiry Received',
    KS: formType === 'reserve' ? '[PASI] 예약 접수 확인' : '[PASI] 문의 접수 확인',
    CN: formType === 'reserve' ? '[PASI] 预约确认' : '[PASI] 咨询确认'
  };
  return subjects[language] || subjects['JP'];
}

// 生成自动回复邮件 HTML
function generateAutoReplyHTML(data, language) {
  const formType = data['formType'] || 'contact';
  
  const messages = {
    JP: {
      greeting: 'お問合せありがとうございます。',
      received: '以下のお問合せを受け付けました。',
      note: 'なお、お問い合わせ状況やご質問内容によって、お返事を差し上げるのにお時間がかかってしまう場合がございます。',
      understand: 'ご了承ください。',
      inquiryType: 'お問い合わせ項目',
      name: '氏名',
      furigana: 'フリガナ',
      email: 'メールアドレス',
      address: '住所',
      phone: '電話番号',
      mobile: '携帯番号',
      message: 'お問い合わせ内容',
      programName: 'プログラム名',
      boardingDate: '乗船日',
      stayDays: '宿泊日数',
      members: '参加人数',
      gender: '性別',
      birthDate: '生年月日',
      paymentMethod: '支払方法',
      remarks: '備考'
    },
    EN: {
      greeting: 'Thank you for your inquiry.',
      received: 'We have received the following information:',
      note: 'Please note that depending on the nature of your inquiry, it may take some time for us to respond.',
      understand: 'We appreciate your understanding.',
      inquiryType: 'Inquiry Type',
      name: 'Name',
      furigana: 'Furigana',
      email: 'Email',
      address: 'Address',
      phone: 'Phone',
      mobile: 'Mobile',
      message: 'Message',
      programName: 'Program',
      boardingDate: 'Boarding Date',
      stayDays: 'Stay Days',
      members: 'Participants',
      gender: 'Gender',
      birthDate: 'Birth Date',
      paymentMethod: 'Payment Method',
      remarks: 'Remarks'
    },
    KS: {
      greeting: '문의해 주셔서 감사합니다.',
      received: '다음과 같이 문의를 접수하였습니다:',
      note: '문의 상황이나 질문 내용에 따라 답변을 드리는 데 시간이 걸릴 수 있습니다.',
      understand: '양해해 주시기 바랍니다.',
      inquiryType: '문의 항목',
      name: '성명',
      furigana: '후리가나',
      email: '이메일',
      address: '주소',
      phone: '전화번호',
      mobile: '휴대폰',
      message: '문의 내용',
      programName: '프로그램',
      boardingDate: '승선일',
      stayDays: '숙박일수',
      members: '참가인원',
      gender: '성별',
      birthDate: '생년월일',
      paymentMethod: '결제방법',
      remarks: '비고'
    },
    CN: {
      greeting: '感谢您的咨询。',
      received: '我们已收到以下咨询：',
      note: '根据咨询情况和问题内容，回复可能需要一些时间。',
      understand: '敬请谅解。',
      inquiryType: '咨询项目',
      name: '姓名',
      furigana: '假名',
      email: '邮箱',
      address: '地址',
      phone: '电话',
      mobile: '手机',
      message: '咨询内容',
      programName: '项目名称',
      boardingDate: '登船日期',
      stayDays: '住宿天数',
      members: '参加人数',
      gender: '性别',
      birthDate: '出生日期',
      paymentMethod: '付款方式',
      remarks: '备注'
    }
  };

  const msg = messages[language] || messages['JP'];
  
  if (formType === 'reserve') {
    return generateReserveAutoReplyHTML(data, msg);
  } else {
    return generateContactAutoReplyHTML(data, msg);
  }
}

// 生成联系表单自动回复 HTML
function generateContactAutoReplyHTML(data, msg) {
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0698ba 0%, #0575a0 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 600; }
    .header p { margin: 0; opacity: 0.95; font-size: 15px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 16px; margin-bottom: 20px; line-height: 1.8; }
    .divider { border-top: 2px solid #e0e0e0; margin: 30px 0; }
    .field { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0; }
    .field:last-of-type { border-bottom: none; }
    .field-label { font-weight: 600; color: #0698ba; font-size: 13px; margin-bottom: 8px; }
    .field-value { color: #333; font-size: 15px; word-wrap: break-word; white-space: pre-wrap; }
    .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0698ba; margin-top: 10px; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
    .footer-divider { width: 60px; height: 2px; background: #0698ba; margin: 20px auto; }
    .company-name { font-size: 20px; font-weight: 600; color: #0698ba; margin-bottom: 15px; }
    .contact-info { font-size: 14px; color: #666; line-height: 1.8; }
    .contact-info a { color: #0698ba; text-decoration: none; }
    .contact-info a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛥️ ${msg.received.includes('Received') || msg.received.includes('接수') || msg.received.includes('收到') ? 'Thank you' : 'ありがとうございます'}</h1>
      <p>PASI - Okinawa Lagoon</p>
    </div>
    <div class="content">
      <div class="greeting">
        <p>${msg.greeting}</p>
        <p>${msg.received}</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="field">
        <div class="field-label">■ ${msg.inquiryType}</div>
        <div class="field-value">${inquiryType || '-'}</div>
      </div>
      
      <div class="field">
        <div class="field-label">■ ${msg.name}</div>
        <div class="field-value">${name || '-'}</div>
      </div>
      
      ${furigana ? `
      <div class="field">
        <div class="field-label">■ ${msg.furigana}</div>
        <div class="field-value">${furigana}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">■ ${msg.email}</div>
        <div class="field-value">${email || '-'}</div>
      </div>
      
      ${address ? `
      <div class="field">
        <div class="field-label">■ ${msg.address}</div>
        <div class="field-value">${address}</div>
      </div>
      ` : ''}
      
      ${phone ? `
      <div class="field">
        <div class="field-label">■ ${msg.phone}</div>
        <div class="field-value">${phone}</div>
      </div>
      ` : ''}
      
      ${mobile ? `
      <div class="field">
        <div class="field-label">■ ${msg.mobile}</div>
        <div class="field-value">${mobile}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">■ ${msg.message}</div>
        <div class="message-box">
          <div class="field-value">${message || '-'}</div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="greeting">
        <p>${msg.note}</p>
        <p>${msg.understand}</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-divider"></div>
      <div class="company-name">PASI</div>
      <div class="contact-info">
        <p><a href="https://www.pasi.jp" target="_blank">https://www.pasi.jp</a></p>
        <p><a href="mailto:info@pasi.jp">info@pasi.jp</a></p>
        <p><a href="tel:070-8561-1257">070-8561-1257</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// 生成预约表单自动回复 HTML（简化版，可根据需要扩展）
function generateReserveAutoReplyHTML(data, msg) {
  // 与联系表单类似，但使用预约相关字段
  return generateContactAutoReplyHTML(data, msg);
}

// 生成自动回复邮件纯文本
function generateAutoReplyText(data, language) {
  const formType = data['formType'] || 'contact';
  
  const messages = {
    JP: {
      greeting: 'お問合せありがとうございます。',
      received: '以下のお問合せを受け付けました。',
      note: 'なお、お問い合わせ状況やご質問内容によって、お返事を差し上げるのにお時間がかかってしまう場合がございます。',
      understand: 'ご了承ください。',
      inquiryType: 'お問い合わせ項目',
      name: '氏名',
      furigana: 'フリガナ',
      email: 'メールアドレス',
      address: '住所',
      phone: '電話番号',
      mobile: '携帯番号',
      message: 'お問い合わせ内容'
    },
    EN: {
      greeting: 'Thank you for your inquiry.',
      received: 'We have received the following information:',
      note: 'Please note that depending on the nature of your inquiry, it may take some time for us to respond.',
      understand: 'We appreciate your understanding.',
      inquiryType: 'Inquiry Type',
      name: 'Name',
      furigana: 'Furigana',
      email: 'Email',
      address: 'Address',
      phone: 'Phone',
      mobile: 'Mobile',
      message: 'Message'
    },
    KS: {
      greeting: '문의해 주셔서 감사합니다.',
      received: '다음과 같이 문의를 접수하였습니다:',
      note: '문의 상황이나 질문 내용에 따라 답변을 드리는 데 시간이 걸릴 수 있습니다.',
      understand: '양해해 주시기 바랍니다.',
      inquiryType: '문의 항목',
      name: '성명',
      furigana: '후리가나',
      email: '이메일',
      address: '주소',
      phone: '전화번호',
      mobile: '휴대폰',
      message: '문의 내용'
    },
    CN: {
      greeting: '感谢您的咨询。',
      received: '我们已收到以下咨询：',
      note: '根据咨询情况和问题内容，回复可能需要一些时间。',
      understand: '敬请谅解。',
      inquiryType: '咨询项目',
      name: '姓名',
      furigana: '假名',
      email: '邮箱',
      address: '地址',
      phone: '电话',
      mobile: '手机',
      message: '咨询内容'
    }
  };

  const msg = messages[language] || messages['JP'];
  
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
${msg.greeting}
${msg.received}

${msg.note}
${msg.understand}

■${msg.inquiryType}
${inquiryType || '-'}

■${msg.name}
${name || '-'}

${furigana ? `■${msg.furigana}\n${furigana}\n` : ''}

■${msg.email}
${email || '-'}

${address ? `■${msg.address}\n${address}\n` : ''}

${phone ? `■${msg.phone}\n${phone}\n` : ''}

${mobile ? `■${msg.mobile}\n${mobile}\n` : ''}

■${msg.message}
${message || '-'}

----------------------------------------------------------------
PASI
https://www.pasi.jp
mailto:info@pasi.jp
tel:070-8561-1257
`;
}