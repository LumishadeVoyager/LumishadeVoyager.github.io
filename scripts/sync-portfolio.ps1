[CmdletBinding()]
param(
  [string]$Source = '',
  [switch]$UploadOriginals,
  [switch]$CommitAndPush
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$thumbs = Join-Path $root 'assets\thumbs'
$manifestPath = Join-Path $root 'data\photos.json'
$repository = 'LumishadeVoyager/LumishadeVoyager.github.io'

if ([string]::IsNullOrWhiteSpace($Source)) {
  $driveRoot = Get-ChildItem -LiteralPath 'G:\' -Directory | Select-Object -First 1
  $Source = (Get-ChildItem -LiteralPath $driveRoot.FullName -Directory | Where-Object { $_.Name -eq 'Watermark' } | Select-Object -First 1).FullName
}
if (!(Test-Path -LiteralPath $Source)) { throw "Photo source directory was not found: $Source" }
if (!(Get-Command ffmpeg -ErrorAction SilentlyContinue)) { throw 'ffmpeg is required to generate previews.' }
if ($UploadOriginals -and !(Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI is required to upload originals.' }

New-Item -ItemType Directory -Force -Path $thumbs | Out-Null
$extensions = '.jpg','.jpeg','.png','.webp','.avif'
$files = Get-ChildItem -LiteralPath $Source -File -Recurse | Where-Object { $_.Extension.ToLowerInvariant() -in $extensions } | Sort-Object LastWriteTime, Name
$photos = [System.Collections.Generic.List[object]]::new()

foreach ($file in $files) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($file.FullName.ToLowerInvariant())
  $sha1 = [Security.Cryptography.SHA1]::Create()
  $id = -join ($sha1.ComputeHash($bytes) | ForEach-Object { $_.ToString('x2') })
  $previewRelative = "assets/thumbs/$id.jpg"
  $preview = Join-Path $root ($previewRelative -replace '/', '\\')
  if (!(Test-Path -LiteralPath $preview) -or $file.LastWriteTimeUtc -gt (Get-Item -LiteralPath $preview).LastWriteTimeUtc) {
    & ffmpeg -hide_banner -loglevel error -y -i $file.FullName -vf "scale='if(gt(iw,ih),min(1600,iw),-2)':'if(gt(ih,iw),min(1600,ih),-2)'" -q:v 3 $preview
    if ($LASTEXITCODE -ne 0) { throw "Preview generation failed: $($file.Name)" }
  }
  $encodedName = [Uri]::EscapeDataString($file.Name)
  $photos.Add([ordered]@{
    preview = $previewRelative
    original = "https://github.com/$repository/releases/download/originals/$encodedName"
    filename = $file.Name
    capturedAt = $file.LastWriteTime.ToString('yyyy-MM-dd')
  })
}

$manifest = $photos | ConvertTo-Json -Depth 3
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($manifestPath, $manifest, $utf8WithoutBom)
Write-Host "Generated previews and manifest for $($photos.Count) photos."

if ($UploadOriginals) {
  gh release view originals --repo $repository 2>$null
  if ($LASTEXITCODE -ne 0) { gh release create originals --repo $repository --title '带水印原始作品' --notes '由作品集同步脚本维护。' }
  foreach ($file in $files) {
    gh release upload originals $file.FullName --repo $repository --clobber
    if ($LASTEXITCODE -ne 0) { throw "Original upload failed: $($file.Name)" }
  }
}

if ($CommitAndPush) {
  Push-Location $root
  try {
    git add assets/thumbs data/photos.json
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
      git commit -m "Update photography portfolio"; if ($LASTEXITCODE -ne 0) { throw 'Git commit failed.' }
      git push origin main; if ($LASTEXITCODE -ne 0) { throw 'Git push failed.' }
    } else {
      Write-Host 'No preview or manifest changes to commit.'
    }
  } finally { Pop-Location }
}
