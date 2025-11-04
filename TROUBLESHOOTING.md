# 🔧 Troubleshooting Guide - 故障排查指南

## 问题：点击提交后跳转到 FormSubmit

### 可能的原因和解决方法：

---

## ❌ 问题 1：在本地打开文件

### 症状：
- 地址栏显示 `file:///Users/...`
- 点击提交后跳转到 FormSubmit

### 原因：
本地文件无法调用 API 接口

### 解决方法：
✅ **必须通过 Vercel 部署的网址访问**

正确的网址格式：
```
https://your-project-name.vercel.app/okinawa-lagoon.jp/contact/
```

❌ 错误的访问方式：
```
file:///Users/arjen/Desktop/okinawa-lagoon/okinawa-lagoon.jp/contact/index.html
```

---

## ❌ 问题 2：浏览器缓存

### 症状：
- 使用 Vercel 网址访问
- 但代码看起来是旧版本
- 点击后还是跳转到 FormSubmit

### 解决方法：

#### 方法 1：强制刷新
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + R`
- **Chrome**: `Cmd/Ctrl + F5`

#### 方法 2：清除缓存
1. 打开开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

#### 方法 3：无痕模式测试
- 打开无痕/隐私窗口
- 访问网站
- 测试表单

---

## ❌ 问题 3：Vercel 部署未更新

### 症状：
- 强制刷新后问题依旧
- 代码在 GitHub 上是最新的

### 检查步骤：

#### 1. 检查 Vercel 部署状态
访问：https://vercel.com/dashboard

查看：
- ✅ 最新的 commit 是否已部署
- ✅ 部署状态是否为 "Ready"
- ❌ 是否有部署错误

#### 2. 手动触发重新部署
1. 进入项目
2. 点击 "Deployments"
3. 点击最新部署
4. 点击右上角 "Redeploy"

#### 3. 检查环境变量
确认以下环境变量已设置：
```
SMTP_USER=info@pasi.jp
SMTP_PASSWORD=upyx dupq akzz xfnq
RECIPIENT_EMAIL=info@pasi.jp
```

---

## 🔍 调试方法

### 打开浏览器控制台

1. 按 F12 打开开发者工具
2. 切换到 "Console" 标签
3. 刷新页面

### 查看调试信息

如果代码正确加载，您应该看到：
```
🔧 Contact form script loaded - Version 2.0
Form element found: true
```

点击提交按钮后应该看到：
```
✅ Form submit event triggered!
🚫 Default form submission prevented
Email 1: xxx@example.com
Email 2: xxx@example.com
📦 Form data collected: {...}
📤 Sending to API...
```

### 如果看到 FormSubmit

**说明 JavaScript 没有正确运行**

可能原因：
1. ❌ 代码未更新
2. ❌ JavaScript 错误
3. ❌ jQuery 未加载
4. ❌ 在本地打开文件

---

## ✅ 正确的测试流程

### 第 1 步：确认使用 Vercel 网址
```
https://your-project.vercel.app/okinawa-lagoon.jp/contact/
```

### 第 2 步：清除浏览器缓存
按 `Cmd + Shift + R` (Mac) 或 `Ctrl + Shift + R` (Windows)

### 第 3 步：打开控制台
按 F12，查看 Console 标签

### 第 4 步：填写表单
填写所有必填项

### 第 5 步：提交并观察
- ✅ 控制台应该显示调试信息
- ✅ 按钮变为"送信中..."
- ✅ 收到成功提示
- ❌ **不应该**跳转到任何页面

---

## 🆘 仍然有问题？

### 检查清单：

- [ ] 使用 Vercel 网址（不是 file:///）
- [ ] 强制刷新浏览器（Cmd/Ctrl + Shift + R）
- [ ] 检查控制台是否显示"Version 2.0"
- [ ] Vercel 部署状态为 "Ready"
- [ ] 环境变量已正确设置
- [ ] 无痕模式测试

### 收集调试信息：

1. 打开控制台（F12）
2. 提交表单
3. 截图控制台输出
4. 检查 "Network" 标签
5. 查找 "contact" 请求
6. 查看请求和响应

---

## 📝 快速验证命令

### 验证代码版本：

在控制台输入：
```javascript
$('#contactForm').length
```

应该返回：`1`（表示表单存在）

### 验证 jQuery：
```javascript
typeof jQuery
```

应该返回：`"function"`

### 手动触发提交：
```javascript
$('#contactForm').submit()
```

应该触发表单提交逻辑（而不是跳转到其他页面）

---

## 联系支持

如果以上方法都无法解决问题，请提供：
1. Vercel 部署网址
2. 浏览器控制台截图
3. Network 标签截图
4. 使用的浏览器版本


