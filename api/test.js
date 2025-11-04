// Simple test endpoint to verify API routes are working

module.exports = (req, res) => {
  // Hardcoded credentials (same as in contact.js)
  const SMTP_USER = 'info@pasi.jp';
  const SMTP_PASSWORD = 'upyx dupq akzz xfnq';
  const RECIPIENT_EMAIL = 'info@pasi.jp';
  
  res.status(200).json({
    success: true,
    message: 'API routes are working! ✅',
    timestamp: new Date().toISOString(),
    config: {
      smtpUser: SMTP_USER,
      recipientEmail: RECIPIENT_EMAIL,
      passwordLength: SMTP_PASSWORD.length,
      status: 'Credentials are hardcoded and ready to use'
    }
  });
};

