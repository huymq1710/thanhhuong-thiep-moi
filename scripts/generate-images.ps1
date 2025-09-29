# Image Generation Script

# Tạo thumbnails và medium size cho tất cả images
# Chạy script này để generate multiple sizes

param(
    [string]$InputDir = "src/assets/images",
    [string]$OutputDir = "public/optimized"
)

# Tạo thư mục output nếu chưa có
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
}

# Tạo các thư mục con
$sizes = @("thumbnails", "medium", "full")
foreach ($size in $sizes) {
    $sizeDir = Join-Path $OutputDir $size
    if (!(Test-Path $sizeDir)) {
        New-Item -ItemType Directory -Path $sizeDir -Force
    }
}

Write-Host "Image directories created successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Use an image processing tool like ImageMagick or online tools"
Write-Host "2. Create thumbnails (150x225px), medium (400x600px), full (original)"
Write-Host "3. Or use the Vercel Image Optimization API we'll implement"