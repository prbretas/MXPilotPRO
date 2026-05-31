# ============================================
# MenteMX Pro - Iniciar App Mobile (Expo Go)
# ============================================
# Execute este script no PowerShell:
#   .\start-mobile.ps1
#
# Pré-requisitos:
#   1. Node.js 20+ instalado
#   2. Expo Go instalado no celular (compatível com SDK 54)
#   3. Celular e PC na mesma rede Wi-Fi
#
# Key de teste para ativação:
#   MXPR-ADMN-2024-TEST
# ============================================

Write-Host ""
Write-Host "🏁 MenteMX Pro - Iniciando App Mobile (SDK 54)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Detectar IP local automaticamente
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback" -and $_.PrefixOrigin -eq "Dhcp" } | Select-Object -First 1).IPAddress

if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback" } | Select-Object -First 1).IPAddress
}

Write-Host "📡 Seu IP local: $ip" -ForegroundColor Green
Write-Host ""

# Atualizar o arquivo de API com o IP correto
$apiFile = "$PSScriptRoot\apps\mobile\src\constants\api.ts"
$apiContent = @"
/**
 * Configuração da API — MenteMX Pro Mobile
 * IP atualizado automaticamente pelo script start-mobile.ps1
 */

export const API_BASE_URL = __DEV__
  ? 'http://${ip}:3000'
  : 'https://api.mentemxpro.com';
"@

Set-Content -Path $apiFile -Value $apiContent -Encoding UTF8
Write-Host "✅ API configurada para: http://${ip}:3000" -ForegroundColor Green
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "$PSScriptRoot\node_modules")) {
    Write-Host "📦 Instalando dependências (primeira vez)..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npm install --legacy-peer-deps
}

# Iniciar Expo
Write-Host "📱 Iniciando Expo (SDK 54)..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Instruções:" -ForegroundColor Yellow
Write-Host "  1. Abra o app Expo Go no celular" -ForegroundColor White
Write-Host "  2. Escaneie o QR Code que vai aparecer abaixo" -ForegroundColor White
Write-Host "  3. Na primeira vez, use a key: MXPR-ADMN-2024-TEST" -ForegroundColor Green
Write-Host "  4. Depois faça login ou crie uma conta" -ForegroundColor White
Write-Host ""
Write-Host "Para parar: Ctrl+C" -ForegroundColor Gray
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\apps\mobile"
npx expo start
