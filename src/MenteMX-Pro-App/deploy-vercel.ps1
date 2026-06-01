# ============================================
# MenteMX Pro - Deploy Backend na Vercel
# ============================================
# Execute: .\deploy-vercel.ps1
#
# Pré-requisitos:
#   1. Conta Vercel: https://vercel.com/signup
#   2. Vercel CLI: npm i -g vercel
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🏁 MenteMX Pro - Deploy Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "  📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "  🚀 Fazendo deploy do backend..." -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\apps\backend"
vercel --prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Deploy concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  A URL do seu backend apareceu acima." -ForegroundColor White
Write-Host "  Atualize o arquivo api.ts do mobile com essa URL." -ForegroundColor White
Write-Host ""
