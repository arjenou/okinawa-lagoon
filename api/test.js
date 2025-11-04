// Simple test endpoint to verify API routes are working

module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API routes are working!',
    timestamp: new Date().toISOString(),
    environment: {
      hasSmtpUser: !!process.env.SMTP_USER,
      hasSmtpPassword: !!process.env.SMTP_PASSWORD,
      hasRecipientEmail: !!process.env.RECIPIENT_EMAIL
    }
  });
};

