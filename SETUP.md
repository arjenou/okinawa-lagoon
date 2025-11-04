# Okinawa Lagoon - Setup Guide

## 📧 SMTP Email Configuration

This website uses Gmail SMTP to send contact form emails.

### Environment Variables Required

You need to configure the following environment variables in Vercel:

```
SMTP_USER=info@pasi.jp
SMTP_PASSWORD=upyx dupq akzz xfnq
RECIPIENT_EMAIL=info@pasi.jp
```

### 🚀 Deploying to Vercel

#### Option 1: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Set Environment Variables**:
```bash
vercel env add SMTP_USER
# Enter: info@pasi.jp

vercel env add SMTP_PASSWORD
# Enter: upyx dupq akzz xfnq

vercel env add RECIPIENT_EMAIL
# Enter: info@pasi.jp
```

5. **Deploy to Production**:
```bash
vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/
2. Import your GitHub repository
3. Go to **Project Settings** → **Environment Variables**
4. Add the following variables:
   - `SMTP_USER` = `info@pasi.jp`
   - `SMTP_PASSWORD` = `upyx dupq akzz xfnq`
   - `RECIPIENT_EMAIL` = `info@pasi.jp`
5. Redeploy the project

---

## 🔒 Security Notes

- The SMTP password is a Google App-Specific Password
- It's stored securely in Vercel's environment variables
- Never commit the actual password to Git
- The password in this file should be deleted after setup

---

## ✅ Testing the Contact Form

1. Visit your deployed website
2. Navigate to the Contact page (お問い合わせ)
3. Fill out the form and submit
4. Check `info@pasi.jp` for the email

---

## 📝 Email Template

The email you receive will include:
- Beautiful HTML formatting
- All form fields clearly labeled
- Direct reply functionality (replyTo field set to user's email)
- Mobile-responsive design

---

## 🛠️ Troubleshooting

### Email not sending?

1. **Check Vercel logs**:
   - Go to your project in Vercel Dashboard
   - Click on "Deployments"
   - Click on the latest deployment
   - Check "Functions" logs

2. **Verify environment variables**:
   - Make sure all 3 variables are set
   - Make sure there are no extra spaces
   - Redeploy after setting variables

3. **Check Gmail settings**:
   - Verify 2-Step Verification is enabled
   - Verify the App-Specific Password is correct
   - Try generating a new App-Specific Password

### Form submission error?

- Open browser console (F12)
- Check for JavaScript errors
- Verify `/api/contact` endpoint is accessible

---

## 📞 Support

For issues or questions, contact: info@pasi.jp

