# 杨文俊摄影作品集

这是部署在 GitHub Pages 的静态摄影作品站。页面只包含经压缩的预览图；带水印的原始文件作为公开 GitHub Release 资源提供查看与下载。

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
