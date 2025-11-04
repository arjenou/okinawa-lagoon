# 🚀 Quick Start Guide - Okinawa Lagoon

## 立即部署到 Vercel（5 分钟搞定）

### 第 1 步：打开 Vercel

访问：https://vercel.com/new

### 第 2 步：导入 GitHub 仓库

1. 点击 **"Import Git Repository"**
2. 搜索或选择：`arjenou/okinawa-lagoon`
3. 点击 **"Import"**

### 第 3 步：配置环境变量

在部署页面，展开 **"Environment Variables"**，添加以下三个：

| Name | Value |
|------|-------|
| `SMTP_USER` | `info@pasi.jp` |
| `SMTP_PASSWORD` | `upyx dupq akzz xfnq` |
| `RECIPIENT_EMAIL` | `info@pasi.jp` |

### 第 4 步：部署

点击 **"Deploy"** 按钮，等待 1-2 分钟

### 第 5 步：测试

1. 部署完成后，点击 **"Visit"** 查看网站
2. 进入 **お問い合わせ** 页面
3. 填写表单并提交
4. 检查 `info@pasi.jp` 邮箱

---

## ✅ 完成！

您应该会在邮箱收到一封格式精美的邮件！

---

## 🔧 Vercel CLI 方式（开发者推荐）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署（会提示配置环境变量）
vercel

# 添加环境变量
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD  
vercel env add RECIPIENT_EMAIL

# 生产部署
vercel --prod
```

---

## 📞 需要帮助？

查看详细文档：
- `SETUP.md` - 完整设置指南
- `EMAIL_PREVIEW.md` - 邮件样式预览

---

## 🎉 邮件功能特点

- ✅ 自定义 HTML 邮件模板
- ✅ 自动设置回复地址（一键回复客户）
- ✅ 手机号码和邮箱可点击
- ✅ 响应式设计
- ✅ 防垃圾邮件保护
- ✅ 多语言支持
- ✅ 使用您自己的 Gmail 账号发送


