# 🚀 手动部署到 Vercel

## 问题
Vercel 无法自动识别项目需要运行 `npm install`，导致 API 函数无法部署。

## 解决方案 A：在 Vercel Dashboard 配置

### 步骤：
1. 访问：https://vercel.com/dashboard
2. 进入项目 `okinawa-lagoon`
3. 点击 "Settings"
4. 点击 "General"
5. 找到 "Build & Development Settings"
6. 点击 "Override" 开关
7. 配置：
   - **Framework Preset**: `Other`
   - **Install Command**: `npm install`
   - **Build Command**: (留空)
   - **Output Directory**: `okinawa-lagoon.jp`
8. 点击 "Save"
9. 返回 "Deployments"
10. 点击最新部署的 "..." → "Redeploy"

### 预期结果：
重新部署时应该看到：
```
Running "install" command: `npm install`...
added 1 package, and audited 2 packages
```

然后应该看到：
```
Serverless Functions:
  /api/hello
  /api/test
  /api/contact
  /api/send-test-email
```

## 解决方案 B：删除并重新创建项目

如果上面不行：

1. 在 Vercel Dashboard 删除当前项目
2. 重新从 GitHub 导入
3. 导入时选择：
   - Framework Preset: `Other`
   - Root Directory: (留空)
4. 完成导入后，进入 Settings 配置：
   - Install Command: `npm install`
   - Output Directory: `okinawa-lagoon.jp`

## 测试

部署成功后，访问：
```
https://www.pasi.jp/api/hello
```

应该看到：
```json
{
  "message": "Hello from Vercel API! 🎉",
  ...
}
```

然后测试联系表单：
```
https://www.pasi.jp/contact/
```

提交后应该：
- 不跳转页面
- 显示成功提示
- 邮件发送到 info@pasi.jp

