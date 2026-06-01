# ============================================
# MenteMX Pro - Deploy Backend no Railway
# ============================================
# USE ESTE PARA PRODUÇÃO (quando sair do protótipo)
#
# Execute: .\deploy-railway.ps1
#
# Pré-requisitos:
#   1. Conta Railway: https://railway.app
#   2. Railway CLI: npm i -g @railway/cli
#
# Vantagens sobre Vercel:
#   - PostgreSQL incluso
#   - Sem timeout de 10s
#   - WebSocket suportado
#   - Melhor para API com banco
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🏁 MenteMX Pro - Deploy Railway" -ForegroundColor Cyan
Write-Host "  (PRODUÇÃO - usar quando sair do protótipo)" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "  📦 Instalando Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

Write-Host "  🚀 Fazendo deploy..." -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\apps\backend"
railway up

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Deploy concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
