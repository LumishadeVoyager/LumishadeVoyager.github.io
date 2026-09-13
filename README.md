# 杨文俊个人主页

这是一个以“水下工程实验日志”为视觉线索的个人主页，集中展示 Project Remo、深智鲨、锤头鲨、研究支线、实习实践、模型制作与内容创作。站点刻意弱化传统简历结构，也不把摄影作为个人主身份。

## 内容结构

- 核心项目：Project Remo、深智鲨、锤头鲨
- 研究支线：学习风险识别、海底飞侠、深蓝净
- 实践经历：影石创新、海默新宸、青岛策海
- 创作区域：模型制作、硬件原型与少量视觉记录
- 内容入口：B 站、小红书、抖音、GitHub

B 站、小红书和抖音卡片已完成版式。收到准确账号主页 URL 后，只需填写 `data/socials.json` 即可激活入口，避免误连到同名账号。

## 更新作品

在 Windows PowerShell 中运行：

```powershell
.\scripts\sync-portfolio.ps1 -UploadOriginals -CommitAndPush
```

默认来源为 `G:\我的云端硬盘\Watermark`。脚本会：

1. 扫描 JPEG、PNG、WebP 与 AVIF 图片；
2. 生成最长边 1600px 的预览图和 `data/photos.json`；
3. 把原始水印文件上传或更新到 `originals` Release；
4. 提交并推送站点更新。

首次发布需完成约 3 GB 原图上传，耗时取决于网络。仅更新网页预览而不上传原图时，移除 `-UploadOriginals`。

## 发布

推送到 `main` 后，GitHub Actions 会部署到 `https://lumishadevoyager.github.io/`。

## 隐私

网站未使用简历中的电话号码、邮箱、证件或其他敏感个人资料。若要公开联系方式，请在 `index.html` 中手动添加。
