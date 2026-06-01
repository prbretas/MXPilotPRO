# ============================================
# MenteMX Pro - Gerar APK (Android)
# ============================================
# Execute: .\build-apk.ps1
#
# Pré-requisitos:
#   1. Node.js 18+
#   2. Conta Expo (gratuita): https://expo.dev/signup
#   3. EAS CLI: npm install -g eas-cli
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🏁 MenteMX Pro - Build APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar EAS CLI
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if (-not $easInstalled) {
    Write-Host "  📦 Instalando EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
}

# Verificar login
Write-Host "  🔑 Verificando login Expo..." -ForegroundColor Gray
$whoami = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠️  Você precisa fazer login no Expo:" -ForegroundColor Yellow
    Write-Host "     Execute: eas login" -ForegroundColor White
    Write-Host "     Crie conta em: https://expo.dev/signup" -ForegroundColor White
    Write-Host ""
    eas login
}

Write-Host ""
Write-Host "  🔨 Iniciando build do APK..." -ForegroundColor Green
Write-Host "     Isso pode demorar 5-15 minutos (build na nuvem)" -ForegroundColor Gray
Write-Host ""

Set-Location "$PSScriptRoot\apps\mobile"

# Build APK (perfil preview = APK instalável)
eas build --platform android --profile preview --non-interactive

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Build concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  O link para download do APK apareceu acima." -ForegroundColor White
Write-Host "  Baixe e envie para o celular via WhatsApp/Drive." -ForegroundColor White
Write-Host ""
Write-Host "  Para instalar:" -ForegroundColor Yellow
Write-Host "  1. No celular: Configurações > Segurança" -ForegroundColor White
Write-Host "  2. Ative 'Fontes desconhecidas'" -ForegroundColor White
Write-Host "  3. Abra o APK e instale" -ForegroundColor White
Write-Host ""
